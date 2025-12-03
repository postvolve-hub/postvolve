"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Function to scroll to section smoothly
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Handler for section links
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    if (pathname !== "/") {
      // If not on home page, navigate to home with hash temporarily
      // The useEffect in Home component will handle scrolling after page loads
      window.location.href = `/#${sectionId}`;
    } else {
      // If already on home page, just scroll without updating URL
      scrollToSection(sectionId);
      // Clean URL by removing hash if present
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
    
    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  const navigationLinks = [
    { href: "/#how-it-works", label: "How It Works", sectionId: "how-it-works" },
    { href: "/#features", label: "Features", sectionId: "features" },
    { href: "/pricing", label: "Pricing", isLink: true },
    { href: "/contact", label: "Contact", isLink: true },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
            onClick={() => {
              // Scroll to top when logo is clicked
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image 
              src="/favicon.png" 
              alt="PostVolve Logo" 
              width={32} 
              height={32} 
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-heading text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary/80">
              Post<span className="text-primary">Volve</span>
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigationLinks.map((link) =>
            link.isLink ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => link.sectionId && handleSectionClick(e, link.sectionId)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/signin">
            <Button variant="ghost" className="text-sm font-medium hover:bg-primary/5 transition-all duration-300">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-primary/30">
              Start Free Trial
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium shadow-lg shadow-primary/20 transition-all duration-300 h-9 px-4">
              Start Free Trial
            </Button>
          </Link>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      // Scroll to top when logo is clicked
                      if (pathname === "/") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                  >
                    <Image 
                      src="/favicon.png" 
                      alt="PostVolve Logo" 
                      width={32} 
                      height={32} 
                    />
                    <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
                      Post<span className="text-primary">Volve</span>
                    </span>
                  </Link>
                </div>
                
                <nav className="flex flex-col space-y-4 flex-grow">
                  {navigationLinks.map((link) => (
                    <div key={link.href}>
                      {link.isLink ? (
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-base font-medium text-foreground hover:text-primary transition-colors duration-300 py-2"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          onClick={(e) => {
                            if (link.sectionId) {
                              handleSectionClick(e, link.sectionId);
                            } else {
                              setMobileMenuOpen(false);
                            }
                          }}
                          className="block text-base font-medium text-foreground hover:text-primary transition-colors duration-300 py-2 cursor-pointer"
                        >
                          {link.label}
                        </a>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="flex flex-col gap-3 pt-8 border-t border-border">
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

