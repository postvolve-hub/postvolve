"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// Dashboard preview image - located in public folder
const dashboardImage = "/dashboard-preview.png";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";
import { motion } from "framer-motion";

// --- Custom SVG Icons ---

const IconSixSecond = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
  </svg>
);

const IconViralTemplates = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
    <path d="M16 15h2" />
    <path d="M16 18h2" />
  </svg>
);

const IconScheduling = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-purple-500">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

const IconAI = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const IconBusiness = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-600">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconBreaking = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-red-500">
    <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
    <path d="M12 2a10 10 0 0 1 10 10" opacity="0.5" />
    <path d="M12 12 2.1 12.1" />
  </svg>
);

const IconMotivation = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-yellow-500">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

// Stats Section Custom Icons
const IconTrendingUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconZap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconBarChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </svg>
);

// Social Media Icons
const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="h-6 w-6 md:h-12 md:w-12">
    <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z" fill="currentColor" />
  </svg>
);

const IconFacebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="h-6 w-6 md:h-12 md:w-12">
    <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" fill="currentColor" />
  </svg>
);

const IconLinkedIn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-6 w-6 md:h-12 md:w-12">
    <path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="h-6 w-6 md:h-12 md:w-12">
    <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z" fill="currentColor" />
  </svg>
);

// --- Components ---

const Hero = () => {
  // Floating icons configuration - positioned away from center text area
  const floatingIcons = [
    // Social Media Icons - positioned at edges with responsive positioning
    { Icon: IconInstagram, position: "top-[5%] left-[1%] sm:top-[8%] sm:left-[2%]", color: "text-pink-500", animation: "animate-float", rotation: 12 },
    { Icon: IconFacebook, position: "top-[12%] right-[1%] sm:top-[15%] sm:right-[3%]", color: "text-blue-600", animation: "animate-float-slow", rotation: -6 },
    { Icon: IconLinkedIn, position: "top-[8%] left-[5%] sm:top-[12%] sm:left-[55%]", color: "text-blue-600", animation: "animate-float-fast", rotation: 8 },
    { Icon: IconX, position: "top-[18%] right-[3%] sm:top-[22%] sm:right-[8%]", color: "text-foreground", animation: "animate-float", rotation: -12 },
  ];

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-16">
      {/* Angled Linear Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.08) 0%, rgba(59, 130, 246, 0.06) 50%, rgba(109, 40, 217, 0.04) 100%)'
          }}
        />
      </div>

      {/* Floating Animated Icons with Glassmorphism */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingIcons.map((item, index) => {
          const IconComponent = item.Icon;
          // Extract color for glow effect
          const getGlowColor = (color: string) => {
            if (color.includes('pink')) return 'bg-pink-500';
            if (color.includes('blue-700')) return 'bg-blue-700';
            if (color.includes('blue-600')) return 'bg-blue-600';
            if (color.includes('blue-500')) return 'bg-blue-500';
            if (color.includes('primary')) return 'bg-primary';
            return 'bg-primary';
          };
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4 + (index * 0.15),
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`absolute ${item.position} ${item.animation} transition-all duration-300`}
              style={{
                transform: `rotate(${item.rotation}deg)`,
              }}
            >
              <div className="relative group">
                {/* Glassmorphism container with shine effect */}
                <div className="relative backdrop-blur-sm md:backdrop-blur-md bg-white/25 dark:bg-white/15 rounded-lg md:rounded-2xl p-1.5 md:p-3 border border-white/40 shadow-lg md:shadow-xl shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/35">
                  {/* Shine overlay */}
                  <div className="absolute inset-0 rounded-lg md:rounded-2xl bg-gradient-to-br from-white/50 via-white/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                  {/* Icon */}
                  <div className={`relative ${item.color} drop-shadow-md md:drop-shadow-lg filter brightness-110`}>
                    <IconComponent />
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 md:-inset-2 rounded-lg md:rounded-2xl ${getGlowColor(item.color)} opacity-25 blur-xl md:blur-2xl -z-10 group-hover:opacity-40 transition-opacity duration-300`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center relative z-10">
        
        <FadeIn delay={0.1}>
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-primary bg-primary/10 hover:bg-primary/20 border-primary/20 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300">
            Automated Authority
          </Badge>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mb-6 leading-[1.1]">
            Viral News Cards That Drive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Real Engagement.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed mx-auto">
            Generate, Schedule, Post, and Analyze Viral News Cards, Automatically. 
            Stop spending hours researching and designing daily.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} className="w-full max-w-2xl mt-6 mb-8 md:mb-20">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <Input 
              type="email" 
              placeholder="Enter your work email address..." 
              className="h-20 sm:h-12 rounded-lg border-muted-foreground/20 focus-visible:ring-primary transition-all duration-300 flex-1 w-full sm:w-auto text-lg sm:text-sm placeholder:text-base sm:placeholder:text-base px-5 sm:px-3"
            />
            <Button size="lg" className="w-full sm:w-auto h-14 sm:h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 whitespace-nowrap text-base sm:text-sm">
              Get Started Free
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            No credit card required. Connect accounts instantly.
          </p>
        </FadeIn>

        {/* Dashboard Mockup with Enhanced Overlays */}
        <FadeIn delay={0.6} className="w-full hidden md:block md:mt-8">
          <div className="relative w-full max-w-5xl mx-auto rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl shadow-primary/20 overflow-hidden group hover:shadow-primary/30 transition-all duration-500">
            {/* Enhanced gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 via-transparent to-transparent z-10 h-full w-full pointer-events-none opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40 z-10 pointer-events-none opacity-40"></div>
            
            {/* Border glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            
            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-2xl opacity-50" />
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl opacity-50" />
            
            <img 
              src={dashboardImage} 
              alt="PostVolve Dashboard Interface" 
              className="relative w-full h-auto rounded-2xl transform transition-transform duration-700 group-hover:scale-[1.01] z-0"
            />
            
            {/* Floating UI Badge for depth */}
            <div className="absolute bottom-8 right-8 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-border/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 hover:scale-105 transition-transform duration-300">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-600 shadow-lg shadow-green-500/20">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Post Published</p>
                <p className="text-sm font-bold text-foreground">Success! +24% Engagement</p>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

const ContentCategories = () => {
  const categories = [
    {
      icon: <IconAI />,
      title: "AI & Emerging Tech",
      description: "Curated summaries on LLMs, automation, and deep learning trends."
    },
    {
      icon: <IconBusiness />,
      title: "Business & Finance",
      description: "Market analysis, startup strategy, and investment insights."
    },
    {
      icon: <IconBreaking />,
      title: "Breaking Tech News",
      description: "Timely, concise updates on hardware, software, and industry shifts."
    },
    {
      icon: <IconMotivation />,
      title: "Motivational & Leadership",
      description: "High-impact quotes and principles for personal and professional development."
    }
  ];

  return (
    <section id="how-it-works" className="pt-12 pb-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-16">
           <FadeIn>
              <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
                Niche Expertise
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Content That Establishes You as an Expert
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Our engine focuses exclusively on the high-value niches that drive professional engagement and network growth.
              </p>
           </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((cat, index) => (
            <StaggerItem key={index}>
              <Card className="border-border/40 bg-secondary/10 hover:bg-background transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 cursor-default group h-full flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 flex-grow">
                  <div className="flex-shrink-0">
                     {cat.icon}
                  </div>
                  <div className="space-y-1 flex-grow">
                     <CardTitle className="text-lg font-semibold">{cat.title}</CardTitle>
                     <CardDescription className="text-base leading-relaxed">{cat.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <IconSixSecond />,
      title: "The 6-Second Content Engine",
      description: "Our asynchronous backend pulls fresh data and generates full visual assets and captions, ready for review in under 6 seconds.",
    },
    {
      icon: <IconViralTemplates />,
      title: "Viral News Card Templates",
      description: "Automatically applies high-contrast, data-driven design to ensure your posts cut through the noise and are instantly shareable.",
    },
    {
      icon: <IconScheduling />,
      title: "Set It and Forget It Posting",
      description: "Connect your social accounts, select your posting category (Tech, AI, Business), and enable the daily auto-scheduler.",
    }
  ];

  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              The Content Engine That Replaces 4 Tools
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Streamline your entire social media workflow from ideation to publication.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <Card className="border-border/50 bg-background transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/50 h-full">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

const SocialProof = () => {
  return (
    <section className="py-20 bg-background border-y border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
           <FadeIn>
             <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">
              Trusted by Thought Leaders in Tech
            </h2>
           </FadeIn>
          
          <FadeIn delay={0.2}>
            <Card className="max-w-3xl mx-auto bg-secondary/10 border-none shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="pt-8 pb-8 px-6 md:px-12">
                <div className="flex flex-col items-center text-center space-y-6">
                   <div className="text-primary opacity-30">
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
                     </svg>
                   </div>
                   <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-foreground">
                    "PostVolve gave me back 10 hours a week and immediately doubled my impression count. Essential for building authority."
                   </blockquote>
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                     <div className="text-left">
                       <div className="font-bold text-sm">Alex Rivera</div>
                       <div className="text-xs text-muted-foreground">CEO, Innovation Labs</div>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-12 pt-8 border-t border-border/40">
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                 As featured in
               </p>
               <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-80">
                  {/* Placeholder Logos using simple text/shapes for now to keep it clean */}
                  <div className="flex items-center gap-2"><div className="h-6 w-6 bg-foreground rounded-sm"></div><span className="font-bold text-lg">TechCrunch</span></div>
                  <div className="flex items-center gap-2"><div className="h-6 w-6 bg-foreground rounded-sm"></div><span className="font-bold text-lg">Forbes</span></div>
                  <div className="flex items-center gap-2"><div className="h-6 w-6 bg-foreground rounded-sm"></div><span className="font-bold text-lg">Fast Company</span></div>
                  <div className="flex items-center gap-2"><div className="h-6 w-6 bg-foreground rounded-sm"></div><span className="font-bold text-lg">MIT Tech Review</span></div>
               </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    {
      icon: <IconTrendingUp />,
      value: "10,000+",
      label: "Posts Generated",
      description: "Viral news cards created"
    },
    {
      icon: <IconUsers />,
      value: "500+",
      label: "Active Users",
      description: "Thought leaders growing"
    },
    {
      icon: <IconZap />,
      value: "6 Seconds",
      label: "Generation Time",
      description: "From idea to ready-to-post"
    },
    {
      icon: <IconBarChart />,
      value: "3.2x",
      label: "Avg. Engagement",
      description: "Higher than manual posts"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <FadeIn>
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
              By The Numbers
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Trusted Results That Speak for Themselves
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Join hundreds of professionals who've transformed their social media presence with PostVolve's viral news cards.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <Card className="border-border/40 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 text-center h-full flex flex-col">
                <CardContent className="pt-6 pb-6 px-6 flex flex-col flex-grow">
                  <div className="flex justify-center mb-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center text-primary">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-heading">
                    {stat.value}
                  </div>
                  <div className="text-base font-semibold text-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground mt-auto">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How does the news card generation work?",
      answer: "PostVolve uses AI to pull the latest news and trends from your selected categories (Tech, AI, Business, Motivation), then automatically generates visually compelling news cards with engaging captions. The entire process takes under 6 seconds, and you can review and customize before posting."
    },
    {
      question: "Can I customize the generated news cards?",
      answer: "Absolutely! Every generated news card can be reviewed and edited. You can modify the caption, adjust the visual design, change the posting schedule, or regenerate if it doesn't match your style. Full control while maintaining automation."
    },
    {
      question: "Which social media platforms are supported?",
      answer: "Currently, PostVolve supports LinkedIn and Twitter/X, with more platforms coming soon. You can connect multiple accounts and schedule posts across all of them simultaneously."
    },
    {
      question: "What happens during the free trial?",
      answer: "The 7-day free trial gives you full access to all features. You can generate unlimited news cards, connect your social accounts, schedule posts, and access analytics. No credit card required, and you can cancel anytime."
    },
    {
      question: "How does the auto-posting scheduler work?",
      answer: "Once enabled, PostVolve automatically generates fresh news cards daily and posts them at your preferred time. You can set different schedules for different categories, pause anytime, or review posts before they go live. You're always in control."
    },
    {
      question: "Is there a limit on how many posts I can generate?",
      answer: "Post generation limits depend on your plan. Starter plans include daily auto-posts, while Professional and Enterprise plans offer multiple posts per day and custom generation limits. Check our pricing page for specific details."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
              Frequently Asked
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Know
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Got questions? We've got answers. Here's everything you need to know about PostVolve.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-3xl mx-auto">
          <FadeIn delay={0.2}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border/40 rounded-lg px-6 bg-secondary/10 hover:bg-secondary/20 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-blue-600 text-white">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Ready to Build Your <span className="whitespace-nowrap inline-block"><span className="text-white font-extrabold">Automated</span> <span className="text-white/70 font-bold">Authority</span></span>?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
              Join hundreds of thought leaders who've transformed their social media presence with viral news cards. Start your free 7-day trial today.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/signup">
                <Button 
                  className="h-11 px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-2xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-black/30"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  className="h-11 px-8 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold transition-all duration-300"
                >
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-white" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-white" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-white" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Simple Plans for Serious Growth
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the perfect plan to scale your automated authority.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Tier 1 */}
          <StaggerItem className="h-full">
            <Card className="border-border/60 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/30 bg-background h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-muted-foreground">Starter Plan</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">$50</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2 font-medium text-foreground">Consistent Authority</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> Daily Auto-Posts</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> 2 Categories</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> Basic Analytics</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full hover:bg-primary/5 transition-colors">Get Started</Button>
              </CardFooter>
            </Card>
          </StaggerItem>

          {/* Tier 2 - Highlighted */}
          <StaggerItem className="h-full">
            <Card className="relative border-primary shadow-2xl shadow-primary/10 z-10 bg-background transition-transform duration-300 hover:scale-[1.02] h-full flex flex-col">
               <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 bg-gradient-to-r from-primary to-blue-600 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-medium text-primary">Professional Plan</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight">$199</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2 font-medium text-foreground">Scaling Influence</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4 text-sm text-foreground">
                  <li className="flex items-center"><div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2"><Check className="h-3 w-3 text-primary" /></div> Multiple Schedules</li>
                  <li className="flex items-center"><div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2"><Check className="h-3 w-3 text-primary" /></div> All 4 Categories</li>
                  <li className="flex items-center"><div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2"><Check className="h-3 w-3 text-primary" /></div> Post Customization</li>
                  <li className="flex items-center"><div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2"><Check className="h-3 w-3 text-primary" /></div> Priority Support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 transition-all duration-300 hover:shadow-primary/40">Choose Professional</Button>
              </CardFooter>
            </Card>
          </StaggerItem>

          {/* Tier 3 */}
          <StaggerItem className="h-full">
            <Card className="border-border/60 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/30 bg-background h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-muted-foreground">Enterprise Plan</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">Custom</span>
                </div>
                <CardDescription className="mt-2 font-medium text-foreground">Full Automation & Collaboration</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center"><Check className="h-4 w-4 text-blue-500 mr-2" /> All Pro Features</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-blue-500 mr-2" /> Future Team Collaboration</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-blue-500 mr-2" /> Brand Voice Tuning</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-blue-500 mr-2" /> Dedicated Account Manager</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full hover:bg-primary/5 transition-colors">Contact Sales</Button>
              </CardFooter>
            </Card>
          </StaggerItem>

        </StaggerContainer>
      </div>
    </section>
  );
};

export default function Home() {
  const pathname = usePathname();

  // Handle scrolling to section when page loads with hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1); // Remove the # symbol
      const element = document.getElementById(sectionId);
      if (element) {
        // Wait for page to fully render
        setTimeout(() => {
          const offset = 80; // Account for sticky navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <ContentCategories />
        <Features />
        <Stats />
        <SocialProof />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

