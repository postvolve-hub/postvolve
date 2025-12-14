"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Link2, 
  MessageSquare, 
  Upload,
  ArrowRight,
  Loader2,
  Check,
  Globe,
  FileText,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

// Social Platform Icons
const IconLinkedIn = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const IconX = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z" fill="currentColor" />
  </svg>
);

const IconFacebook = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" fill="currentColor" />
  </svg>
);

const IconInstagram = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z" fill="currentColor" />
  </svg>
);

interface GenerateNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GenerationMode = "url" | "prompt";
type GenerationStep = "select" | "input" | "generating" | "preview";

const PLATFORMS = [
  { id: "linkedin", name: "LinkedIn", icon: IconLinkedIn, color: "text-[#0A66C2]", charLimit: 280 },
  { id: "x", name: "X", icon: IconX, color: "text-black", charLimit: 280 },
  { id: "facebook", name: "Facebook", icon: IconFacebook, color: "text-[#1877F2]", charLimit: 280 },
  { id: "instagram", name: "Instagram", icon: IconInstagram, color: "text-[#E4405F]", charLimit: 280 },
];

const CATEGORIES = [
  { id: "tech", label: "Tech", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "ai", label: "AI", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "business", label: "Business", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "motivation", label: "Motivation", color: "bg-orange-100 text-orange-700 border-orange-200" },
];

export function GenerateNowModal({ isOpen, onClose }: GenerateNowModalProps) {
  const [mode, setMode] = useState<GenerationMode | null>(null);
  const [step, setStep] = useState<GenerationStep>("select");
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin", "x"]);
  const [selectedCategory, setSelectedCategory] = useState("ai");
  const [isGenerating, setIsGenerating] = useState(false);
  const [urlPreview, setUrlPreview] = useState<{ title: string; domain: string } | null>(null);

  // Manage image preview URL
  useEffect(() => {
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(uploadedFile);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreviewUrl(null);
    }
  }, [uploadedFile]);

  const resetModal = () => {
    setMode(null);
    setStep("select");
    setUrl("");
    setPrompt("");
    setUploadedFile(null);
    setImagePreviewUrl(null);
    setSelectedPlatforms(["linkedin", "x"]);
    setSelectedCategory("ai");
    setIsGenerating(false);
    setUrlPreview(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleModeSelect = (selectedMode: GenerationMode) => {
    setMode(selectedMode);
    setStep("input");
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    // Simulate URL preview extraction
    if (value && value.startsWith("http")) {
      try {
        const urlObj = new URL(value);
        setUrlPreview({
          title: "Article title will appear here...",
          domain: urlObj.hostname
        });
      } catch {
        setUrlPreview(null);
      }
    } else {
      setUrlPreview(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate()) return;

    setIsGenerating(true);
    setStep("generating");

    try {
      // Get user ID from auth
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let response: Response;
      
      if (mode === "url") {
        // Call URL generation endpoint
        response = await fetch('/api/generate/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            url,
            category: selectedCategory,
            platforms: selectedPlatforms,
            userPrompt: undefined,
          }),
        });
      } else {
        // Call prompt generation endpoint
        // First, upload image if provided
        let imageUrl = undefined;
        if (uploadedFile) {
          try {
            // Upload image to Supabase Storage
            const formData = new FormData();
            formData.append('file', uploadedFile);
            formData.append('userId', user.id);

            const uploadResponse = await fetch('/api/upload/image', {
              method: 'POST',
              body: formData,
            });

            if (!uploadResponse.ok) {
              const error = await uploadResponse.json();
              throw new Error(error.message || 'Failed to upload image');
            }

            const uploadResult = await uploadResponse.json();
            if (uploadResult.success && uploadResult.imageUrl) {
              imageUrl = uploadResult.imageUrl;
            } else {
              throw new Error('Upload failed - no image URL returned');
            }
          } catch (error: any) {
            console.error('Error uploading image:', error);
            toast({
              title: "Image Upload Failed",
              description: error.message || "Failed to upload image. Continuing without image.",
              variant: "destructive",
            });
            // Continue without image - don't block generation
          }
        }

        response = await fetch('/api/generate/prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            prompt: prompt,
            category: selectedCategory,
            platforms: selectedPlatforms,
            imageUrl: imageUrl,
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Generation failed');
      }

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Content Generated",
          description: "Your new content has been added to drafts.",
        });
        handleClose();
        // Trigger page refresh
        window.dispatchEvent(new CustomEvent('postGenerated'));
      } else {
        throw new Error(result.message || 'Generation failed');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: error.message || 'Failed to generate content. Please try again.',
        variant: "destructive",
      });
    }
  };

  const canGenerate = () => {
    if (selectedPlatforms.length === 0) return false;
    if (mode === "url" && !url) return false;
    if (mode === "prompt" && !prompt) return false;
    return true;
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
                <Sparkles className="h-5 w-5 text-[#6D28D9]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Generate New Content</h2>
                <p className="text-xs text-gray-500">Create a post from URL or custom prompt</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Step 1: Select Mode */}
            {step === "select" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-6">How would you like to create your content?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* URL Option */}
                  <button
                    onClick={() => handleModeSelect("url")}
                    className="group p-6 border-2 border-gray-200 rounded-2xl hover:border-[#6D28D9] hover:bg-[#6D28D9]/5 transition-all duration-200 text-left"
                  >
                    <div className="w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                      <Link2 className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">From URL</h3>
                    <p className="text-sm text-gray-500">
                      Paste an article or blog link. AI will summarize and create a post.
                    </p>
                    <Badge variant="outline" className="mt-3 text-xs text-blue-600 border-blue-200 bg-blue-50">
                      URL-Driven
                    </Badge>
                  </button>

                  {/* Custom Prompt Option (with image upload) */}
                  <button
                    onClick={() => handleModeSelect("prompt")}
                    className="group p-6 border-2 border-gray-200 rounded-2xl hover:border-[#6D28D9] hover:bg-[#6D28D9]/5 transition-all duration-200 text-left"
                  >
                    <div className="w-14 h-14 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-4 transition-colors">
                      <MessageSquare className="h-7 w-7 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Custom Prompt</h3>
                    <p className="text-sm text-gray-500">
                      Write your own prompt with optional image upload for context.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">
                        Custom
                      </Badge>
                      <Badge variant="outline" className="text-xs text-gray-500 border-gray-200 bg-gray-50">
                        + Image
                      </Badge>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Input */}
            {step === "input" && (
              <div className="space-y-6">
                {/* Back button */}
                <button
                  onClick={() => setStep("select")}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  ← Back to options
                </button>

                {/* URL Input */}
                {mode === "url" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Article URL
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={url}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          placeholder="https://example.com/article..."
                          className="h-12 pl-11 border-gray-200 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* URL Preview */}
                    {urlPreview && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{urlPreview.title}</p>
                            <p className="text-xs text-gray-500">{urlPreview.domain}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Prompt Input with Optional Image Upload */}
                {mode === "prompt" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Your Prompt
                      </label>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Write a LinkedIn post about the importance of AI in modern business, focusing on practical applications..."
                        className="min-h-[120px] border-gray-200 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 rounded-xl resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Be specific about the tone, audience, and key points you want to cover.
                      </p>
                    </div>

                    {/* Optional Image Upload */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                        Reference Image
                        <span className="text-xs font-normal text-gray-400">(optional)</span>
                      </label>
                      {!uploadedFile ? (
                        <label className="block">
                          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-[#6D28D9]/50 hover:bg-[#6D28D9]/5 transition-all duration-200 cursor-pointer">
                            <div className="flex items-center justify-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Upload className="h-5 w-5 text-gray-400" />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-medium text-gray-700">
                                  Add an image for context
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, or GIF (max 10MB)
                                </p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {imagePreviewUrl ? (
                                <div className="w-14 h-14 rounded-lg border border-gray-200 overflow-hidden bg-white">
                                  <img 
                                    src={imagePreviewUrl} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUploadedFile(null)}
                              className="text-gray-500 hover:text-red-500 h-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Category Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Content Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                          selectedCategory === category.id
                            ? category.color
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Target Platforms
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PLATFORMS.map((platform) => {
                      const isSelected = selectedPlatforms.includes(platform.id);
                      const IconComponent = platform.icon;
                      return (
                        <button
                          key={platform.id}
                          onClick={() => togglePlatform(platform.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-[#6D28D9] bg-[#6D28D9]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <IconComponent className={`h-5 w-5 ${platform.color}`} />
                          <span className={`text-sm ${isSelected ? "font-medium text-gray-900" : "text-gray-600"}`}>
                            {platform.name}
                          </span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-[#6D28D9] ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    AI will optimize content length for each selected platform.
                  </p>
                </div>
              </div>
            )}

            {/* Generating State */}
            {isGenerating && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#6D28D9]/10 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="h-8 w-8 text-[#6D28D9] animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Creating Your Content...
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  {mode === "url" && "Analyzing the article and generating your post..."}
                  {mode === "prompt" && (uploadedFile 
                    ? "Analyzing your image and prompt to craft the perfect post..." 
                    : "Processing your prompt and crafting the perfect post..."
                  )}
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#6D28D9] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-[#6D28D9] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-[#6D28D9] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {step === "input" && !isGenerating && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate()}
                  className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
                >
                  Generate Content
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

