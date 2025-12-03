import React from "react";
import { Link } from "wouter";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import dashboardImage from "@assets/generated_images/modern_saas_dashboard_for_social_media_automation.png";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";

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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary mb-4">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const IconBusiness = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-600 mb-4">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconBreaking = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-red-500 mb-4">
    <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
    <path d="M12 2a10 10 0 0 1 10 10" opacity="0.5" />
    <path d="M12 12 2.1 12.1" />
  </svg>
);

const IconMotivation = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-yellow-500 mb-4">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);


// --- Components ---

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] opacity-50" />
      </div>

      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        
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
            Generate, Schedule, and Analyze High-Impact Visual Content, Automatically. 
            Stop spending hours researching and designing daily.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} className="w-full max-w-md">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <Input 
              type="email" 
              placeholder="Enter your work email address..." 
              className="h-12 rounded-lg border-muted-foreground/20 focus-visible:ring-primary transition-all duration-300"
            />
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105">
              Claim Your Free 7-Day Trial
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-16">
            No credit card required. Connect accounts instantly.
          </p>
        </FadeIn>

        {/* Dashboard Mockup */}
        <FadeIn delay={0.6} className="w-full">
          <div className="relative w-full max-w-5xl mx-auto rounded-xl border border-border/50 bg-background/50 backdrop-blur shadow-2xl shadow-primary/10 overflow-hidden group hover:shadow-primary/20 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 h-full w-full pointer-events-none opacity-20"></div>
            <img 
              src={dashboardImage} 
              alt="PostVolve Dashboard Interface" 
              className="w-full h-auto rounded-xl transform transition-transform duration-700 group-hover:scale-[1.01]"
            />
            {/* Floating UI Badge for depth */}
            <div className="absolute bottom-8 right-8 z-20 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-xl border border-border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 hover:scale-105 transition-transform duration-300">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
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
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
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
              <Card className="border-border/40 bg-secondary/10 hover:bg-background transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 cursor-default group h-full">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                  <div className="p-3 rounded-xl bg-background shadow-sm ring-1 ring-border group-hover:ring-primary/20 transition-all duration-300">
                     {cat.icon}
                  </div>
                  <div className="space-y-1">
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
                   <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-foreground">
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
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <ContentCategories />
        <Features />
        <SocialProof />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
