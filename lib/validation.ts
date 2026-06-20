import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const apiKeysSchema = z.object({
  apiKeyGemini: z.string().min(10, 'Gemini API key is required'),
  apiKeyGroq: z.string().min(10, 'Groq API key is required'),
  apiKeyAnthropic: z.string().optional(),
});
