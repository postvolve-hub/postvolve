import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MessageSquare, Phone, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/Motion";
import { useMutation } from "@tanstack/react-query";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit form");
      }
      return response.json();
    },
    onSuccess: () => {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative overflow-hidden pt-16 md:pt-24 pb-16">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] opacity-50" />
          <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] opacity-50" />
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Left Column: Info */}
            <div className="flex flex-col justify-center h-full space-y-8">
              <FadeIn>
                <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                  Get in <span className="text-primary">Touch</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Have questions about our enterprise plans or need a custom integration? 
                  Our team is ready to help you automate your authority.
                </p>
              </FadeIn>

              <div className="space-y-6">
                <FadeIn delay={0.1}>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Email Us</h3>
                      <p className="text-muted-foreground text-sm">support@postvolve.com</p>
                      <p className="text-muted-foreground text-sm">sales@postvolve.com</p>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Live Chat</h3>
                      <p className="text-muted-foreground text-sm">Available Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <div className="flex items-start space-x-4">
                     <div className="mt-1 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Call Us</h3>
                      <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </FadeIn>
              </div>

              <FadeIn delay={0.4}>
                <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                  <p className="text-sm font-medium text-foreground italic">
                    "The support team at PostVolve helped us set up our custom templates in less than 24 hours. Incredible service."
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    — Sarah J., Marketing Director
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Form */}
            <FadeIn delay={0.2} className="w-full">
              <Card className="border-border/60 shadow-xl shadow-primary/5 bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitMutation.isSuccess ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">Thank you!</h3>
                      <p className="text-muted-foreground">
                        We've received your message and will get back to you shortly.
                      </p>
                      <Button 
                        onClick={() => submitMutation.reset()} 
                        variant="outline"
                        className="mt-4"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                          <Input 
                            id="firstName" 
                            placeholder="Jane" 
                            className="transition-all focus-visible:ring-primary"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                          <Input 
                            id="lastName" 
                            placeholder="Doe" 
                            className="transition-all focus-visible:ring-primary"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">Work Email</label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="jane@company.com" 
                          className="transition-all focus-visible:ring-primary"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                        <Input 
                          id="subject" 
                          placeholder="Enterprise Inquiry" 
                          className="transition-all focus-visible:ring-primary"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us about your team's needs..." 
                          className="min-h-[150px] transition-all focus-visible:ring-primary resize-none"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {submitMutation.isError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                          {submitMutation.error instanceof Error ? submitMutation.error.message : "An error occurred"}
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-12 transition-all hover:scale-[1.02]"
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </FadeIn>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
