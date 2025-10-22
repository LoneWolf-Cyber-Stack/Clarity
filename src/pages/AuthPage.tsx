import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Toaster } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
export function AuthPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email);
      } else {
        await register(email);
      }
      navigate('/');
    } catch (error) {
      // Error toast is handled in the store
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen w-screen bg-background text-foreground font-sans flex flex-col items-center justify-center p-4 relative">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <ThemeToggle className="absolute top-4 right-4 z-50" />
      <div className="flex items-center gap-2 mb-8">
        <BookText className="w-8 h-8 text-foreground" />
        <h1 className="text-4xl font-display font-bold text-foreground">Clarity</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Enter your email to sign in to your journal.' : 'Enter your email to get started.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Register'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <Button
              variant="link"
              className="pl-1"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Register' : 'Sign In'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Toaster richColors closeButton />
    </div>
  );
}