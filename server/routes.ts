import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Contact form endpoint - will be migrated to Supabase later
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      // TODO: Store in Supabase when implemented
      // For now, just validate and return success
      res.status(201).json({ 
        success: true, 
        message: "Thank you for contacting us! We'll get back to you shortly.",
        id: "temp-id" // Will be replaced with Supabase ID
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "An error occurred while submitting your message. Please try again." 
        });
      }
    }
  });

  return httpServer;
}
