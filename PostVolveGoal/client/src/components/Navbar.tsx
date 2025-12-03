import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-heading text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary/80">
              Post<span className="text-primary">Volve</span>
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300">
            How It Works
          </a>
           <a href="/#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300">
            Features
          </a>
          <a href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300">
            Pricing
          </a>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300">
            Contact
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/signin">
            <Button variant="ghost" className="hidden sm:flex text-sm font-medium hover:bg-primary/5 transition-all duration-300">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-primary/30">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
