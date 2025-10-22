export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// New type for user authentication
export interface User {
  id: string; // email
  createdAt: number;
}
// Updated type for the Clarity journal application
export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: number; // epoch millis
  updatedAt: number; // epoch millis
}