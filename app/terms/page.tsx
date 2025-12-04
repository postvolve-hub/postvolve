"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  const lastUpdated = "December 3, 2024";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      
      <main className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          
          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-sm">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none text-muted-foreground leading-relaxed space-y-8">
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Introduction</h2>
              <p>
                Welcome to PostVolve. By using our website and services, you agree to these Terms of Service and our Privacy Policy. Please read them carefully. If you do not agree with any part of these terms, you should not use our service.
              </p>
              <p>
                If you have any questions, please contact us at <a href="mailto:support@postvolve.com" className="text-primary hover:underline">support@postvolve.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Account Registration</h2>
              <p>
                To use PostVolve, you must create an account. You agree to provide accurate and complete information during registration and keep your account information up to date.
              </p>
              <p>
                You are responsible for maintaining the security of your account and password. You must notify us immediately of any unauthorized access to your account. You must be at least 18 years old to use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Service Description</h2>
              <p>
                PostVolve is an AI-powered content generation and social media automation platform. Our service allows you to generate content, schedule posts, and publish to connected social media accounts.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Purchases and Payments</h2>
              <p>
                If you purchase a subscription, you agree to provide accurate payment information. By providing payment details, you confirm that you are authorized to use the payment method.
              </p>
              <p>
                Subscriptions automatically renew unless cancelled before the renewal date. You can cancel your subscription at any time through your account settings. Refund requests are handled on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Acceptable Use</h2>
              <p>You agree not to use PostVolve to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Generate illegal, harmful, threatening, or abusive content</li>
                <li>Create spam, misleading information, or content that violates others' rights</li>
                <li>Impersonate any person or entity</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with or disrupt the service</li>
              </ul>
              <p className="mt-3">
                We reserve the right to suspend or terminate accounts that violate these guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Content and Ownership</h2>
              <p>
                You retain ownership of the original content you create and publish through PostVolve. We do not claim ownership of your content.
              </p>
              <p>
                All content on the PostVolve platform—including software, graphics, logos, and trademarks—are the property of PostVolve. Unauthorized use, reproduction, or distribution is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">AI-Generated Content</h2>
              <p>
                Content generated by our AI is provided for your convenience. You are responsible for reviewing all content before publishing. AI-generated content may contain errors or require editing.
              </p>
              <p>
                You maintain full editorial responsibility for any content published through your connected social accounts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Services</h2>
              <p>
                PostVolve integrates with third-party social media platforms. When you connect your accounts, you agree to comply with their respective terms of service. We are not responsible for changes to third-party platforms or their policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Disclaimer of Warranty</h2>
              <p>
                PostVolve is provided on an "as is" and "as available" basis without any warranties, expressed or implied. We do not guarantee the service will be uninterrupted, error-free, or completely secure.
              </p>
              <p>
                Your use of the service is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, PostVolve shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. This includes loss of profits, data, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Termination</h2>
              <p>
                We may suspend or terminate your account at any time for violations of these terms or for any other reason at our discretion. Upon termination, your right to use the service ends immediately.
              </p>
              <p>
                You may terminate your account at any time by discontinuing use of the service or contacting support.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Changes to Terms</h2>
              <p>
                We may update these Terms of Service at any time. We will notify you of significant changes by email or through the service. Your continued use of PostVolve after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:support@postvolve.com" className="text-primary hover:underline">support@postvolve.com</a>
              </p>
            </section>

          </div>

          {/* Bottom Link */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              See also: <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
