import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, JournalEntryEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { JournalEntry, User } from "@shared/types";
import { authMiddleware, createSession, clearSession } from './auth';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AUTH ROUTES (Public)
  app.post('/api/auth/register', async (c) => {
    const { email } = await c.req.json<{ email: string }>();
    if (!isStr(email) || !email.includes('@')) return bad(c, 'Valid email is required');
    const user = new UserEntity(c.env, email);
    if (await user.exists()) return bad(c, 'User already exists');
    const newUser: User = { id: email, createdAt: Date.now() };
    await UserEntity.create(c.env, newUser);
    await createSession(c, email);
    return ok(c, newUser);
  });
  app.post('/api/auth/login', async (c) => {
    const { email } = await c.req.json<{ email: string }>();
    if (!isStr(email)) return bad(c, 'Email is required');
    const user = new UserEntity(c.env, email);
    if (!(await user.exists())) return notFound(c, 'User not found');
    await createSession(c, email);
    return ok(c, await user.getState());
  });
  app.post('/api/auth/logout', (c) => {
    clearSession(c);
    return ok(c, { success: true });
  });
  app.get('/api/auth/me', authMiddleware, async (c) => {
    const userId = c.var.userId;
    if (!userId) return notFound(c, 'Not logged in');
    const user = new UserEntity(c.env, userId);
    return ok(c, await user.getState());
  });
  // JOURNAL ENTRIES (Protected)
  const journalApp = new Hono<{ Bindings: Env }>();
  journalApp.use('*', authMiddleware);
  journalApp.get('/', async (c) => {
    const userId = c.var.userId!;
    const page = await JournalEntryEntity.list(c.env, userId);
    page.items.sort((a, b) => b.updatedAt - a.updatedAt);
    return ok(c, page.items);
  });
  journalApp.get('/:id', async (c) => {
    const id = c.req.param('id');
    const entry = new JournalEntryEntity(c.env, id);
    if (!await entry.exists()) return notFound(c, 'Journal entry not found');
    const entryState = await entry.getState();
    if (entryState.userId !== c.var.userId) return c.json({ success: false, error: 'Forbidden' }, 403);
    return ok(c, entryState);
  });
  journalApp.post('/', async (c) => {
    const userId = c.var.userId!;
    const { title, content } = (await c.req.json()) as Partial<JournalEntry>;
    if (!isStr(title)) return bad(c, 'Title is required');
    const now = Date.now();
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      userId,
      title: title.trim(),
      content: content || '',
      createdAt: now,
      updatedAt: now,
    };
    await JournalEntryEntity.create(c.env, newEntry);
    return ok(c, newEntry);
  });
  journalApp.put('/:id', async (c) => {
    const userId = c.var.userId!;
    const id = c.req.param('id');
    const { title, content } = (await c.req.json()) as Partial<JournalEntry>;
    if (!isStr(title) && typeof content === 'undefined') return bad(c, 'Title or content is required');
    const entry = new JournalEntryEntity(c.env, id);
    if (!await entry.exists()) return notFound(c, 'Journal entry not found');
    const currentState = await entry.getState();
    if (currentState.userId !== userId) return c.json({ success: false, error: 'Forbidden' }, 403);
    const updatedState = await entry.mutate(s => ({
      ...s,
      title: title?.trim() ?? s.title,
      content: content ?? s.content,
      updatedAt: Date.now(),
    }));
    return ok(c, updatedState);
  });
  journalApp.delete('/:id', async (c) => {
    const userId = c.var.userId!;
    const id = c.req.param('id');
    const entry = new JournalEntryEntity(c.env, id);
    if (!await entry.exists()) return notFound(c, 'Journal entry not found');
    const currentState = await entry.getState();
    if (currentState.userId !== userId) return c.json({ success: false, error: 'Forbidden' }, 403);
    const deleted = await JournalEntryEntity.delete(c.env, userId, id);
    if (!deleted) return notFound(c, 'Journal entry not found');
    return ok(c, { id, deleted });
  });
  app.route('/api/journal', journalApp);
}