"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, ChevronRight, Clock, Zap, ArrowRight, User, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// Platform Icons
const IconLinkedIn = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const IconX = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z" fill="currentColor" />
  </svg>
);

const IconFacebook = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" fill="currentColor" />
  </svg>
);

const IconInstagram = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z" fill="currentColor" />
  </svg>
);

// Illustration component using the onboarding image
const WelcomeIllustration = () => (
  <div className="relative w-80 h-80 mx-auto mb-4">
    <Image 
      src="/onboarding.png" 
      alt="PostVolve Onboarding" 
      width={320} 
      height={320}
      className="w-full h-full object-contain"
      priority
    />
  </div>
);

// Platform data
const PLATFORMS = [
  { 
    id: "linkedin", 
    name: "LinkedIn", 
    icon: IconLinkedIn, 
    color: "text-[#0A66C2]",
    bgColor: "bg-[#0A66C2]/10",
    description: "Professional networking & thought leadership"
  },
  { 
    id: "twitter", 
    name: "X (Twitter)", 
    icon: IconX, 
    color: "text-gray-900",
    bgColor: "bg-gray-100",
    description: "Real-time updates & trending conversations"
  },
  { 
    id: "facebook", 
    name: "Facebook", 
    icon: IconFacebook, 
    color: "text-[#1877F2]",
    bgColor: "bg-[#1877F2]/10",
    description: "Community building & broad reach"
  },
  { 
    id: "instagram", 
    name: "Instagram", 
    icon: IconInstagram, 
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]/10",
    description: "Visual storytelling & engagement"
  },
];

// Custom Category Icons
const IconTech = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 8h.01" />
    <path d="M17 8h.01" />
    <path d="M12 8h.01" />
  </svg>
);

const IconAI = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const IconBusiness = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18" />
    <path d="M7 16l4-4 4 4 6-6" />
    <path d="M17 10h4v4" />
  </svg>
);

const IconMotivation = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

// Custom content voice icon
const IconCustomVoice = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4h16v4H4z" />
    <path d="M4 10h10v4H4z" />
    <path d="M4 16h7v4H4z" />
    <path d="M18 10v10" />
    <path d="M15 13h6" />
  </svg>
);

// Category data
const CATEGORIES = [
  { 
    id: "tech", 
    label: "Tech", 
    icon: IconTech, 
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Technology news and innovations" 
  },
  { 
    id: "ai", 
    label: "AI", 
    icon: IconAI, 
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "Artificial intelligence insights" 
  },
  { 
    id: "business", 
    label: "Business", 
    icon: IconBusiness, 
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    description: "Strategy and entrepreneurship" 
  },
  { 
    id: "motivation", 
    label: "Motivation", 
    icon: IconMotivation, 
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    description: "Inspiration and personal growth" 
  },
  {
    id: "custom",
    label: "Custom",
    icon: IconCustomVoice,
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    description: "Describe your own niche or hybrid voice in more detail."
  },
];

// Time options
const TIME_OPTIONS = [
  { value: "06:00", label: "6:00 AM" },
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "20:00", label: "8:00 PM" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0 = welcome, 1 = username, 2-4 = steps
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [usernameError, setUsernameError] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [preferredDraftTime, setPreferredDraftTime] = useState("09:00");
  const [autoPostingEnabled, setAutoPostingEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is authenticated and hasn't completed onboarding
  useEffect(() => {
    async function checkAuth() {
      try {
        const { supabase } = await import("@/lib/supabaseClient");
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Not authenticated, redirect to signin
          router.push("/signin");
          return;
        }

        // Check if user has already completed onboarding
        const { data: userData } = await supabase
          .from("users")
          .select("onboarding_completed, username")
          .eq("id", user.id)
          .single();

        if (userData?.onboarding_completed) {
          // Already completed onboarding, redirect to dashboard
          router.push("/dashboard");
          return;
        }

        // If user already has a username from the database, use it
        if (userData?.username) {
          setUsername(userData.username);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, [router]);

  // Get email from localStorage and set default username (fallback)
  useEffect(() => {
    if (!username) {
      const storedEmail = localStorage.getItem("postvolve_signup_email");
      if (storedEmail) {
        const defaultUsername = storedEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
        setUsername(defaultUsername);
      }
    }
  }, [username]);

  // Check username availability (real DB check)
  const checkUsername = async (value: string) => {
    if (!value || value.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    
    setUsernameStatus("checking");
    
    try {
      const response = await fetch(`/api/users/check-username?username=${encodeURIComponent(value)}`);
      const data = await response.json();
      
      if (data.available) {
        setUsernameStatus("available");
        setUsernameError("");
      } else {
        setUsernameStatus("taken");
        setUsernameError(data.error || "This username is already taken");
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameStatus("idle");
      setUsernameError("Failed to check username availability");
    }
  };

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) {
        checkUsername(username);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(value);
    setUsernameStatus("idle");
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      // Limit to 3 categories
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, categoryId];
    });
  };

  const handleFinish = async () => {
    setIsSubmitting(true);

    try {
      // Get the current user ID from Supabase
      const { supabase } = await import("@/lib/supabaseClient");
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("No user found. Please sign in again.");
        router.push("/signin");
        return;
      }

      // Call the onboarding complete API
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          username,
          platforms: selectedPlatforms,
          categories: selectedCategories,
          preferredDraftTime,
          autoPostingEnabled,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Onboarding API error:", error);
        alert(`Failed to save preferences: ${error.error || "Unknown error"}`);
        setIsSubmitting(false);
        return;
      }

      // Store in localStorage as backup
      const onboardingData = {
        username,
        platforms: selectedPlatforms,
        categories: selectedCategories,
        preferredDraftTime,
        autoPostingEnabled,
        onboardingComplete: true,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem("postvolve_onboarding", JSON.stringify(onboardingData));

      // Check if user selected a plan from pricing page, or default to starter
      const selectedPlan = localStorage.getItem("postvolve_selected_plan") || "starter";
      
      // ALL users (including Starter) must go through Stripe checkout to get trial period
      try {
        const checkoutResponse = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: selectedPlan,
            userId: user.id,
          }),
        });

        const checkoutData = await checkoutResponse.json();

        if (checkoutResponse.ok && checkoutData.url) {
          // Clear selected plan from localStorage
          localStorage.removeItem("postvolve_selected_plan");
          // Redirect to Stripe Checkout
          window.location.href = checkoutData.url;
          return;
        } else {
          // If checkout fails, show error but still redirect to dashboard
          console.error("Checkout failed:", checkoutData);
          alert(`Failed to initiate checkout: ${checkoutData.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error initiating checkout:", error);
        alert("An error occurred. Please try again from the billing page.");
      }
      
      // If checkout failed, redirect to dashboard (user can retry from billing page)
      localStorage.removeItem("postvolve_selected_plan");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      alert("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const getTimeLabel = (value: string) => {
    return TIME_OPTIONS.find(t => t.value === value)?.label || value;
  };

  // Progress indicator
  const ProgressIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              currentStep >= step
                ? "bg-[#6D28D9] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep > step ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-8 h-1 mx-1 rounded-full transition-all duration-300 ${
                currentStep > step ? "bg-[#6D28D9]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8FF] via-[#F8F4FF] to-[#FFF5F8] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6D28D9] mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8FF] via-[#F8F4FF] to-[#FFF5F8] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Welcome Screen - Step 0 */}
        {currentStep === 0 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Image 
                src="/favicon.png" 
                alt="PostVolve Logo" 
                width={40} 
                height={40}
              />
              <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Post<span className="text-primary">Volve</span>
              </span>
            </div>
            
            <WelcomeIllustration />
            
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to PostVolve!
            </h1>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              Automate your professional growth in 3 quick steps. Let's set up your content engine.
            </p>
            
            <Button
              onClick={() => setCurrentStep(1)}
              className="w-full h-12 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium rounded-2xl shadow-lg shadow-[#6D28D9]/25 hover:shadow-xl hover:shadow-[#6D28D9]/30 transition-all duration-300 text-base"
            >
              Let's Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Step 1: Username Setup */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <ProgressIndicator />
            
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Choose Your Username
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              This will be your unique identifier on PostVolve. You can change it later in settings.
            </p>
            
            {/* Username Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline-block w-4 h-4 mr-1.5 text-[#6D28D9]" />
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                <Input
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="yourname"
                  className={`h-12 pl-9 pr-12 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 transition-all duration-200 ${
                    usernameStatus === "taken" 
                      ? "border-red-300 focus:border-red-400" 
                      : usernameStatus === "available"
                      ? "border-emerald-300 focus:border-emerald-400"
                      : "border-gray-200 focus:border-[#6D28D9]/30"
                  }`}
                  maxLength={20}
                />
                {/* Status Icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  )}
                  {usernameStatus === "available" && (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                  {usernameStatus === "taken" && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
              
              {/* Status Message */}
              <div className="mt-2 min-h-[20px]">
                {usernameStatus === "checking" && (
                  <p className="text-xs text-gray-500">Checking availability...</p>
                )}
                {usernameStatus === "available" && (
                  <p className="text-xs text-emerald-600">Username is available!</p>
                )}
                {usernameStatus === "taken" && (
                  <p className="text-xs text-red-500">This username is already taken. Please try another.</p>
                )}
                {usernameStatus === "idle" && username.length > 0 && username.length < 3 && (
                  <p className="text-xs text-gray-500">Username must be at least 3 characters</p>
                )}
              </div>
            </div>
            
            {/* Username Guidelines */}
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 mb-6">
              <p className="text-xs text-gray-600 mb-2 font-medium">Username guidelines:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 3-20 characters long</li>
                <li>• Only lowercase letters, numbers, and underscores</li>
                <li>• Cannot be changed frequently</li>
              </ul>
            </div>
            
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!username || username.length < 3 || usernameStatus !== "available"}
              className="w-full h-12 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium rounded-2xl shadow-lg shadow-[#6D28D9]/25 hover:shadow-xl hover:shadow-[#6D28D9]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Continue
              <span className="ml-2 text-white/70">(1/4)</span>
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Step 2: Platform Selection */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <ProgressIndicator />
            
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Which platforms will you post to?
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Select the social channels you plan to integrate. This helps us optimize content length and style.
            </p>
            
            <div className="space-y-3 mb-6">
              {PLATFORMS.map((platform, index) => {
                const IconComponent = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-4 ${
                      isSelected
                        ? "border-[#6D28D9] bg-[#6D28D9]/5"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${platform.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`h-6 w-6 ${platform.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {platform.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{platform.description}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      isSelected 
                        ? "bg-[#6D28D9] border-[#6D28D9]" 
                        : "border-gray-300"
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-gray-400 text-center mb-6">
              You will authorize the actual connection in Settings later.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex-1 h-12 border-gray-200 text-gray-700 rounded-2xl transition-all duration-200"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={selectedPlatforms.length === 0}
                className="flex-[2] h-12 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium rounded-2xl shadow-lg shadow-[#6D28D9]/25 hover:shadow-xl hover:shadow-[#6D28D9]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Continue
                <span className="ml-2 text-white/70">(2/4)</span>
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Category Selection */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <ProgressIndicator />
            
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Define Your Content Voice
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Select 1-3 categories that align with your brand. The AI engine will only generate content within these niches.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {CATEGORIES.map((category, index) => {
                const isSelected = selectedCategories.includes(category.id);
                const IconComponent = category.icon;
                const isCustom = category.id === "custom";
                
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`relative rounded-2xl border-2 text-center transition-all duration-200 ${
                      isSelected
                        ? "border-[#6D28D9] bg-[#6D28D9]/5"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } ${selectedCategories.length >= 3 && !isSelected ? "opacity-50 cursor-not-allowed" : ""} ${
                      isCustom ? "col-span-2 py-3 px-4 min-h-[80px] flex items-center gap-4 text-left" : "p-5"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    disabled={selectedCategories.length >= 3 && !isSelected}
                  >
                    <div className={isCustom ? "flex items-center gap-3 w-full" : ""}>
                      <div className={isCustom ? "flex items-center gap-3 flex-1" : ""}>
                        <div className={`${
                          isCustom ? "w-10 h-10" : "w-12 h-12 mb-3"
                        } rounded-xl bg-gray-100 flex items-center justify-center transition-all duration-200 ${isSelected ? "bg-[#6D28D9]/10" : ""}`}>
                          <IconComponent className={`h-6 w-6 transition-colors duration-200 ${isSelected ? "text-[#6D28D9]" : "text-gray-600"}`} />
                        </div>
                        <div className={isCustom ? "flex-1 min-w-0" : ""}>
                          <h3 className={`font-semibold text-sm mb-1 ${isSelected ? "text-[#6D28D9]" : "text-gray-900"}`}>
                            {category.label}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className={isCustom
                          ? "w-5 h-5 rounded-full bg-[#6D28D9] flex items-center justify-center shadow-sm flex-shrink-0"
                          : "absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#6D28D9] flex items-center justify-center shadow-sm"
                        }>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-gray-500 text-center mb-6">
              {selectedCategories.length} of 3 categories selected
              {selectedCategories.length === 0 && " • Select at least one to continue"}
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="flex-1 h-12 border-gray-200 text-gray-700 rounded-2xl transition-all duration-200"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(4)}
                disabled={selectedCategories.length === 0}
                className="flex-[2] h-12 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium rounded-2xl shadow-lg shadow-[#6D28D9]/25 hover:shadow-xl hover:shadow-[#6D28D9]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Continue
                <span className="ml-2 text-white/70">(3/4)</span>
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Posting Schedule */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <ProgressIndicator />
            
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Set Your Content Cadence
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              When do you want PostVolve to deliver fresh drafts to your dashboard for review?
            </p>
            
            {/* Time Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline-block w-4 h-4 mr-1.5 text-[#6D28D9]" />
                Draft Ready Time
              </label>
              <div className="relative">
                <select
                  value={preferredDraftTime}
                  onChange={(e) => setPreferredDraftTime(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 transition-all duration-200"
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
              </div>
            </div>
            
            {/* Auto-Post Toggle */}
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Enable Auto-Post</h4>
                    <p className="text-xs text-gray-500">Automatically publish approved drafts</p>
                  </div>
                </div>
                <Switch
                  checked={autoPostingEnabled}
                  onCheckedChange={setAutoPostingEnabled}
                  className="data-[state=checked]:bg-[#6D28D9]"
                />
              </div>
              {autoPostingEnabled && (
                <div className="mt-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                  <span className="text-amber-600 font-bold mt-0.5">!</span>
                  <p>Auto-posting is enabled. Only approved drafts will be published.</p>
                </div>
              )}
            </div>
            
            {/* Confirmation Message */}
            <div className="p-5 bg-[#6D28D9]/5 border border-[#6D28D9]/20 rounded-2xl mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6D28D9]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#6D28D9]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Setup Complete!
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your first set of drafts will be ready by{" "}
                    <strong className="text-[#6D28D9]">{getTimeLabel(preferredDraftTime)}</strong>{" "}
                    tomorrow.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="flex-1 h-12 border-gray-200 text-gray-700 rounded-2xl transition-all duration-200"
              >
                Back
              </Button>
              <Button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex-[2] h-12 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium rounded-2xl shadow-lg shadow-[#6D28D9]/25 hover:shadow-xl hover:shadow-[#6D28D9]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Finish Setup
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

