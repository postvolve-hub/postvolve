// Schema definitions for validation - will be replaced with Supabase types
import { z } from "zod";

// User schema - Supabase Auth will handle user management
export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// User type - will be replaced with Supabase User type
export type SelectUser = {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
};

// Contact submission schema
export const insertContactSubmissionSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

export type ContactSubmission = InsertContactSubmission & {
  id: string;
  createdAt: Date;
};
