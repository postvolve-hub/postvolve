"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// Dashboard preview image - located in public folder
const dashboardImage = "/dashboard-preview.png";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";
import { motion, useScroll, useTransform } from "framer-motion";

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

// Social Media Icons - Accept className prop to allow color customization
const IconInstagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z" fill="currentColor" />
  </svg>
);

const IconFacebook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" fill="currentColor" />
  </svg>
);

const IconLinkedIn = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const IconX = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z" fill="currentColor" />
  </svg>
);

// Tech Partner Icons
const IconOpenAI = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

const IconGemini = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.47 3.38h.94l6.15 10.65v6.59h-.94L12 13.97l-5.68 6.65h-.94v-6.59L11.53 3.38z"/>
  </svg>
);

const IconVercel = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 1L24 21H0L12 1z"/>
  </svg>
);

const IconSupabase = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M13.277 21.526c-.453.723-1.581.415-1.581-.432V12.82h7.64c.803 0 1.276.907.812 1.556l-6.871 7.15zm-2.554-19.052c.453-.723 1.581-.415 1.581.432v8.274H4.664c-.803 0-1.276-.907-.812-1.556l6.871-7.15z"/>
  </svg>
);

const IconNextJS = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 0-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-0.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
  </svg>
);

const IconStripe = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
  </svg>
);

// --- Components ---

// Small floating icon component for hero section
const FloatingIcon = ({ Icon, color, className }: { Icon: React.FC<{ className?: string }>, color: string, className?: string }) => (
  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-lg shadow-gray-200/50 flex items-center justify-center ${className}`}>
    <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color}`} />
  </div>
);

const Hero = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress for the dashboard section
  const { scrollYProgress } = useScroll({
    target: dashboardRef,
    offset: ["start end", "end start"]
  });
  
  // Transform scroll progress to 3D rotation (starts tilted back, reveals to flat)
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [25, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-16">
      {/* Smooth Wavy Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.08) 0%, rgba(236, 233, 250, 0.5) 25%, rgba(250, 245, 255, 0.7) 50%, rgba(236, 233, 250, 0.5) 75%, rgba(147, 51, 234, 0.08) 100%)'
          }}
        />
        {/* Wavy Pattern Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 800"
        >
          <defs>
            <linearGradient id="heroWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(109, 40, 217, 0.15)" />
              <stop offset="50%" stopColor="rgba(147, 51, 234, 0.08)" />
              <stop offset="100%" stopColor="rgba(109, 40, 217, 0.15)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#heroWaveGradient)"
            d="M0,160 Q300,80 600,160 T1200,160 L1200,0 L0,0 Z"
          />
          <path
            fill="url(#heroWaveGradient)"
            opacity="0.6"
            d="M0,500 Q300,400 600,500 T1200,500 L1200,800 L0,800 Z"
          />
        </svg>
      </div>

      {/* Floating Icons - Positioned like GravityWrite */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Top Left - Instagram (#E4405F) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute top-[12%] left-[8%] md:left-[12%]"
        >
          <FloatingIcon Icon={IconInstagram} color="text-[#E4405F]" className="animate-float" />
        </motion.div>

        {/* Top Right - LinkedIn (#0A66C2) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="absolute top-[8%] right-[10%] md:right-[15%]"
        >
          <FloatingIcon Icon={IconLinkedIn} color="text-[#0A66C2]" className="animate-float-slow" />
        </motion.div>

        {/* Middle Left - X/Twitter (black) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute top-[35%] left-[3%] md:left-[8%]"
        >
          <FloatingIcon Icon={IconX} color="text-black" className="animate-float-fast" />
        </motion.div>

        {/* Middle Right - Facebook (#1877F2) */}
            <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute top-[28%] right-[5%] md:right-[10%]"
        >
          <FloatingIcon Icon={IconFacebook} color="text-[#1877F2]" className="animate-float" />
            </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center relative z-20">
        
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
            7-day free trial. Connect accounts instantly.
          </p>
        </FadeIn>

        {/* Dashboard Mockup - Mac Window Style with 3D Scroll Effect */}
        <div ref={dashboardRef} className="w-full hidden md:block md:mt-8" style={{ perspective: "1200px" }}>
          <motion.div 
            className="relative w-full max-w-4xl mx-auto"
            style={{
              rotateX,
              scale,
              opacity,
              transformOrigin: "center bottom",
            }}
          >
            {/* Mac Window Frame */}
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/25 border border-gray-200/50 bg-white">
              {/* Mac Title Bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                {/* Traffic Light Buttons */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-inner"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28CA41] shadow-inner"></div>
                </div>
              </div>
              
              {/* Dashboard Screenshot */}
              <div className="relative">
            <img 
              src={dashboardImage} 
              alt="PostVolve Dashboard Interface" 
                  className="w-full h-auto block"
            />
                {/* Subtle bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </motion.div>
          </div>

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
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-8 text-center">
                 Powered By Industry-Leading Technology
               </p>
               {/* Marquee Container with Blur Edges */}
               <div className="relative overflow-hidden">
                 {/* Left Blur */}
                 <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
                 
                 {/* Right Blur */}
                 <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
                 
                 {/* Marquee Content - Duplicated for seamless loop */}
                 <div className="flex animate-marquee">
                   {/* First Set */}
                   <div className="flex items-center justify-around min-w-full gap-12 px-6">
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconOpenAI className="h-7 w-7 text-[#10A37F]" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">OpenAI</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconGemini className="h-7 w-7 text-[#4285F4]" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Google Gemini</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconVercel className="h-7 w-7 text-black" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Vercel</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconSupabase className="h-7 w-7 text-[#3ECF8E]" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Supabase</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconNextJS className="h-7 w-7 text-black" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Next</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconStripe className="h-7 w-7 text-[#635BFF]" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Stripe</span>
                     </div>
                   </div>
                   
                   {/* Second Set - Duplicate for seamless loop */}
                   <div className="flex items-center justify-around min-w-full gap-12 px-6">
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconOpenAI className="h-7 w-7 text-[#10A37F]" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">OpenAI</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconGemini className="h-7 w-7 text-[#4285F4]" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Google Gemini</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconVercel className="h-7 w-7 text-black" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Vercel</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconSupabase className="h-7 w-7 text-[#3ECF8E]" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Supabase</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconNextJS className="h-7 w-7 text-black" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Next.js</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-3 group">
                       <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                         <IconStripe className="h-7 w-7 text-[#635BFF]" />
                       </div>
                       <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Stripe</span>
                     </div>
                   </div>
                 </div>
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
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-white" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-white" />
                <span>Card required for trial</span>
              </div>
            </div>
          </FadeIn>
        </div>
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

          // Clean up hash from URL after scrolling
          setTimeout(() => {
            window.history.replaceState(null, "", window.location.pathname);
          }, 500);
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
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

