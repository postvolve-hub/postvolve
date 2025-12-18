"use client";

import { useState, useEffect } from "react";
import { 
  Link2, 
  MessageSquare, 
  Upload, 
  FileText, 
  Sparkles, 
  Image as ImageIcon,
  Eye,
  Calendar,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowRight,
  Play,
  X
} from "lucide-react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { SchedulePostModal } from "@/components/dashboard/SchedulePostModal";
import { PublishSuccessModal } from "@/components/dashboard/PublishSuccessModal";
import { useAuth } from "@/hooks/use-auth";
import { PLACEHOLDER_IMAGES } from "@/lib/image-placeholder";
import { convertToUTC, getUserTimezone } from "@/lib/timezone-utils";

type StageStatus = "pending" | "processing" | "completed" | "error" | "skipped";
type GenerationLane = "url" | "prompt";

interface Stage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: StageStatus;
  duration?: number;
  error?: string;
}

interface GenerationPipelineProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (result: any) => void;
}

const INITIAL_STAGES: Stage[] = [
  {
    id: "input",
    title: "Input Source",
    description: "Provide content source",
    icon: <FileText className="h-5 w-5" />,
    status: "pending",
  },
  {
    id: "extract",
    title: "Content Extraction",
    description: "Extracting key information",
    icon: <FileText className="h-5 w-5" />,
    status: "pending",
  },
  {
    id: "ai-process",
    title: "AI Processing",
    description: "Generating optimized content",
    icon: <Sparkles className="h-5 w-5" />,
    status: "pending",
  },
  {
    id: "image-gen",
    title: "Image Generation",
    description: "Creating visual content",
    icon: <ImageIcon className="h-5 w-5" />,
    status: "pending",
  },
  {
    id: "review",
    title: "Review & Edit",
    description: "Finalize your content",
    icon: <Eye className="h-5 w-5" />,
    status: "pending",
  },
  {
    id: "schedule",
    title: "Schedule",
    description: "Set publish time",
    icon: <Calendar className="h-5 w-5" />,
    status: "pending",
  },
];

const STATUS_STYLES: Record<StageStatus, { bg: string; border: string; icon: React.ReactNode }> = {
  pending: {
    bg: "bg-gray-100",
    border: "border-gray-200",
    icon: <div className="w-2 h-2 rounded-full bg-gray-400" />,
  },
  processing: {
    bg: "bg-[#6D28D9]/10",
    border: "border-[#6D28D9]",
    icon: <Loader2 className="h-4 w-4 text-[#6D28D9] animate-spin" />,
  },
  completed: {
    bg: "bg-emerald-50",
    border: "border-emerald-500",
    icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-500",
    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
  },
  skipped: {
    bg: "bg-gray-50",
    border: "border-gray-300 border-dashed",
    icon: <div className="w-2 h-2 rounded-full bg-gray-300" />,
  },
};

// Platform icons and config
const IconLinkedIn = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const IconX = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z" fill="currentColor" />
  </svg>
);

const IconFacebook = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" fill="currentColor" />
  </svg>
);

const IconInstagram = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z" fill="currentColor" />
  </svg>
);

const PLATFORMS = [
  { id: "linkedin", name: "LinkedIn", icon: IconLinkedIn, color: "text-[#0A66C2]" },
  { id: "x", name: "X", icon: IconX, color: "text-black" },
  { id: "facebook", name: "Facebook", icon: IconFacebook, color: "text-[#1877F2]" },
  { id: "instagram", name: "Instagram", icon: IconInstagram, color: "text-[#E4405F]" },
];

export function GenerationPipeline({ isOpen, onClose, onComplete }: GenerationPipelineProps) {
  const { user } = useAuth();
  const [selectedLane, setSelectedLane] = useState<GenerationLane>("url");
  const [inputValue, setInputValue] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin", "x"]);
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    content: string;
    imageUrl: string;
  } | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [generatedPostId, setGeneratedPostId] = useState<string | null>(null);
  const [publishSuccessOpen, setPublishSuccessOpen] = useState(false);
  const [publishResults, setPublishResults] = useState<any[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Manage image preview URL
  useEffect(() => {
    if (uploadedImage && uploadedImage.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(uploadedImage);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreviewUrl(null);
    }
  }, [uploadedImage]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStages(INITIAL_STAGES);
      setCurrentStageIndex(-1);
      setIsGenerating(false);
      setOverallProgress(0);
      setInputValue("");
      setUploadedImage(null);
      setImagePreviewUrl(null);
      setGeneratedContent(null);
      setSelectedPlatforms(["linkedin", "x"]);
    }
  }, [isOpen]);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        if (prev.length === 1) return prev; // Don't allow deselecting if it's the only one
        return prev.filter(p => p !== platformId);
      }
      return [...prev, platformId];
    });
  };

  if (!isOpen) return null;

  const updateStage = (index: number, updates: Partial<Stage>) => {
    setStages(prev => prev.map((stage, i) => 
      i === index ? { ...stage, ...updates } : stage
    ));
  };

  const simulateStage = async (index: number, duration: number) => {
    updateStage(index, { status: "processing" });
    setCurrentStageIndex(index);
    
    // Simulate progress
    const startProgress = (index / stages.length) * 100;
    const endProgress = ((index + 1) / stages.length) * 100;
    const steps = 20;
    const stepDuration = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      setOverallProgress(startProgress + ((endProgress - startProgress) * (i / steps)));
    }
    
    updateStage(index, { status: "completed", duration });
  };

  const startGeneration = async () => {
    if (!inputValue.trim()) return;
    
    setIsGenerating(true);
    
    // Stage 0: Input (already done)
    updateStage(0, { status: "completed" });
    setOverallProgress(10);
    
    try {
      // Get user
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Stage 1: Content Extraction (skip for prompt lane)
      if (selectedLane === "url") {
        updateStage(1, { status: "processing" });
        setCurrentStageIndex(1);
        setOverallProgress(20);
        // Real extraction happens in API
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateStage(1, { status: "completed" });
      } else {
        updateStage(1, { status: "skipped" });
        setOverallProgress(25);
      }
      
      // Stage 2: AI Processing
      updateStage(2, { status: "processing" });
      setCurrentStageIndex(2);
      setOverallProgress(40);
      
      // Stage 3: Image Generation
      updateStage(3, { status: "processing" });
      setCurrentStageIndex(3);
      setOverallProgress(60);
      
      // Call real API
      let response: Response;
      if (selectedLane === "url") {
        response = await fetch('/api/generate/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            url: inputValue,
            category: 'tech', // Default, can be made configurable
            platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['linkedin', 'x'],
          }),
        });
      } else {
        // Upload image if provided
        let imageUrl = undefined;
        if (uploadedImage) {
          try {
            // Upload image to Supabase Storage
            const formData = new FormData();
            formData.append('file', uploadedImage);
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
            // Continue without image - don't block generation
            // The error is logged but we proceed with generation
          }
        }

        response = await fetch('/api/generate/prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            prompt: inputValue,
            category: 'tech', // Default, can be made configurable
            platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['linkedin', 'x'],
            imageUrl: imageUrl,
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Generation failed');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Generation failed');
      }

      // Update stages
      updateStage(2, { status: "completed" });
      updateStage(3, { status: "completed" });
      setOverallProgress(80);
      
      // Set generated content from API response
      const firstContent = result.result?.content?.[0];
      setGeneratedPostId(result.postId || null);
      setGeneratedContent({
        title: result.result?.title || "Generated Post",
        content: firstContent?.content || result.result?.content?.[0] || "Generated content",
        imageUrl: result.result?.image?.imageUrl || PLACEHOLDER_IMAGES.noImage,
      });
      
      // Stage 4: Review
      updateStage(4, { status: "processing" });
      setCurrentStageIndex(4);
      setOverallProgress(85);
      setIsGenerating(false);
      
    } catch (error: any) {
      console.error('Generation error:', error);
      updateStage(currentStageIndex >= 0 ? currentStageIndex : 2, { 
        status: "error", 
        error: error.message || "Generation failed. Please try again." 
      });
      setIsGenerating(false);
    }
  };

  const completeReview = () => {
    updateStage(4, { status: "completed" });
    updateStage(5, { status: "processing" });
    setCurrentStageIndex(5);
    setOverallProgress(95);
  };

  const finishGeneration = async () => {
    if (!generatedContent) return;
    
    // Post is already saved by /api/generate/url or /api/generate/prompt
    // No need to save again - just mark as complete
    updateStage(5, { status: "completed" });
    setOverallProgress(100);
    setCurrentStageIndex(6);
    
    toast({
      title: "Content Generated",
      description: "Your new content has been added to drafts.",
    });
    
    // Trigger page refresh
    window.dispatchEvent(new CustomEvent('postGenerated'));
    
    setTimeout(() => {
      onComplete?.(generatedContent);
      onClose();
    }, 1000);
  };

  const isInputStage = currentStageIndex === -1;
  const isReviewStage = currentStageIndex === 4 && stages[4].status === "processing";
  const isScheduleStage = currentStageIndex === 5 && stages[5].status === "processing";
  const isComplete = overallProgress === 100;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#6D28D9]/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
                <Sparkles className="h-5 w-5 text-[#6D28D9]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Content Generation Pipeline</h2>
                <p className="text-xs text-gray-500">Follow the stages to create your content</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Overall Progress</span>
              <span className="text-xs font-bold text-[#6D28D9]">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Pipeline Visualization */}
          <div className="px-6 py-4 border-b border-gray-100 overflow-x-auto">
            <div className="flex items-center justify-between min-w-max gap-2">
              {stages.map((stage, index) => {
                const statusStyle = STATUS_STYLES[stage.status];
                const isActive = index === currentStageIndex;
                
                return (
                  <div key={stage.id} className="flex items-center">
                    {/* Stage Node */}
                    <div className={`relative flex flex-col items-center ${isActive ? "scale-105" : ""} transition-transform`}>
                      <div
                        className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${statusStyle.bg} ${statusStyle.border} ${
                          isActive ? "ring-4 ring-[#6D28D9]/20" : ""
                        }`}
                      >
                        <div className={`transition-colors ${
                          stage.status === "completed" ? "text-emerald-600" :
                          stage.status === "processing" ? "text-[#6D28D9]" :
                          stage.status === "error" ? "text-red-500" :
                          "text-gray-400"
                        }`}>
                          {stage.icon}
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute -top-1 -right-1">
                        {statusStyle.icon}
                      </div>
                      
                      {/* Label */}
                      <div className="mt-2 text-center max-w-[80px]">
                        <p className={`text-xs font-medium truncate ${
                          isActive ? "text-[#6D28D9]" : 
                          stage.status === "completed" ? "text-emerald-600" :
                          "text-gray-600"
                        }`}>
                          {stage.title}
                        </p>
                        {stage.duration && (
                          <p className="text-[10px] text-gray-400">{(stage.duration / 1000).toFixed(1)}s</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Connector */}
                    {index < stages.length - 1 && (
                      <div className="flex items-center mx-1">
                        <div className={`h-0.5 w-8 transition-colors duration-300 ${
                          stages[index + 1].status !== "pending" ? "bg-emerald-400" : "bg-gray-200"
                        }`} />
                        <ArrowRight className={`h-3 w-3 transition-colors duration-300 ${
                          stages[index + 1].status !== "pending" ? "text-emerald-400" : "text-gray-300"
                        }`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 max-h-[400px] overflow-y-auto">
            {/* Input Stage */}
            {isInputStage && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Select Content Source
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedLane("url")}
                      className={`p-5 rounded-xl border-2 transition-all duration-200 text-center ${
                        selectedLane === "url"
                          ? "border-[#6D28D9] bg-[#6D28D9]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Link2 className={`h-7 w-7 mx-auto mb-2 ${
                        selectedLane === "url" ? "text-[#6D28D9]" : "text-gray-500"
                      }`} />
                      <span className="text-sm font-medium text-gray-700">From URL</span>
                      <p className="text-xs text-gray-400 mt-1">Extract from article or blog</p>
                    </button>
                    <button
                      onClick={() => setSelectedLane("prompt")}
                      className={`p-5 rounded-xl border-2 transition-all duration-200 text-center ${
                        selectedLane === "prompt"
                          ? "border-[#6D28D9] bg-[#6D28D9]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <MessageSquare className={`h-7 w-7 mx-auto mb-2 ${
                        selectedLane === "prompt" ? "text-[#6D28D9]" : "text-gray-500"
                      }`} />
                      <span className="text-sm font-medium text-gray-700">Custom Prompt</span>
                      <p className="text-xs text-gray-400 mt-1">With optional image upload</p>
                    </button>
                  </div>
                </div>

                {/* Platform Selection */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Target Platforms
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((platform) => {
                      const isSelected = selectedPlatforms.includes(platform.id);
                      const IconComponent = platform.icon;
                      return (
                        <button
                          key={platform.id}
                          onClick={() => togglePlatform(platform.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-[#6D28D9] bg-[#6D28D9]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <IconComponent className={`h-4 w-4 ${platform.color}`} />
                          <span className={`text-sm ${isSelected ? "font-medium text-gray-900" : "text-gray-600"}`}>
                            {platform.name}
                          </span>
                          {isSelected && (
                            <CheckCircle className="h-3.5 w-3.5 text-[#6D28D9]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    AI will optimize content for each selected platform.
                  </p>
                </div>

                <div>
                  {selectedLane === "url" && (
                    <>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Article URL
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://example.com/article"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="rounded-xl"
                      />
                    </>
                  )}
                  {selectedLane === "prompt" && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Content Prompt
                        </Label>
                        <Textarea
                          placeholder="Describe the content you want to create..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="rounded-xl min-h-[100px]"
                        />
                      </div>
                      
                      {/* Optional Image Upload */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                          Reference Image
                          <span className="text-xs font-normal text-gray-400">(optional)</span>
                        </Label>
                        {!uploadedImage ? (
                          <label className="block cursor-pointer">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#6D28D9]/50 hover:bg-[#6D28D9]/5 transition-all duration-200">
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <Upload className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="text-left">
                                  <p className="text-sm font-medium text-gray-600">Add image for context</p>
                                  <p className="text-xs text-gray-400">PNG, JPG, GIF (max 10MB)</p>
                                </div>
                              </div>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setUploadedImage(file);
                              }}
                            />
                          </label>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {imagePreviewUrl ? (
                                  <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-white">
                                    <img 
                                      src={imagePreviewUrl} 
                                      alt="Preview" 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{uploadedImage.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setUploadedImage(null)}
                                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Processing Stages */}
            {isGenerating && !isReviewStage && !isScheduleStage && !isComplete && (
              <div className="text-center py-12 animate-in fade-in duration-300">
                <div className="w-20 h-20 rounded-full bg-[#6D28D9]/10 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="h-10 w-10 text-[#6D28D9] animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {stages[currentStageIndex]?.title || "Processing"}...
                </h3>
                <p className="text-sm text-gray-500">
                  {stages[currentStageIndex]?.description || "Please wait"}
                </p>
              </div>
            )}

            {/* Review Stage */}
            {isReviewStage && generatedContent && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Content Generated Successfully!</span>
                  </div>
                  <p className="text-xs text-emerald-600">Review and edit your content below.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Title</Label>
                    <Input
                      value={generatedContent.title}
                      onChange={(e) => setGeneratedContent({
                        ...generatedContent,
                        title: e.target.value
                      })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="row-span-2">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview Image</Label>
                    <div className="rounded-xl overflow-hidden border border-gray-200 aspect-square">
                      <img
                        src={generatedContent.imageUrl}
                        alt="Generated"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Content</Label>
                    <Textarea
                      value={generatedContent.content}
                      onChange={(e) => setGeneratedContent({
                        ...generatedContent,
                        content: e.target.value
                      })}
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Stage */}
            {isScheduleStage && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Ready to Schedule</span>
                  </div>
                  <p className="text-xs text-blue-600">Choose when to publish your content.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={async () => {
                      // Save post first, then open PostCustomizationModal for review and edit
                      if (generatedPostId && user && generatedContent) {
                        try {
                          // Update post with current content
                          const updateResponse = await fetch(`/api/posts/${generatedPostId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              userId: user.id,
                              title: generatedContent.title,
                              content: generatedContent.content,
                              imageUrl: generatedContent.imageUrl,
                              platforms: selectedPlatforms.map(platform => ({
                                platform: platform === 'x' ? 'twitter' : platform,
                                content: generatedContent.content,
                              })),
                            }),
                          });

                          if (!updateResponse.ok) {
                            throw new Error('Failed to update post');
                          }

                          // Close pipeline and trigger event to open customization modal
                          onClose();
                          window.dispatchEvent(new CustomEvent('openPostCustomization', { 
                            detail: { postId: generatedPostId } 
                          }));
                        } catch (error: any) {
                          console.error('Error updating post:', error);
                          toast({
                            title: "Error",
                            description: "Failed to open post editor. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }
                    }}
                    className="w-full p-4 rounded-xl border-2 border-[#6D28D9] bg-[#6D28D9] text-white hover:bg-[#5B21B6] transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="h-5 w-5" />
                    <span className="text-sm font-semibold">Review & Edit</span>
                  </button>
                  <button 
                    onClick={async () => {
                      if (!user || !generatedPostId) {
                        toast({
                          title: "Error",
                          description: "Post ID not found. Please try again.",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      try {
                        const response = await fetch(`/api/posts/${generatedPostId}/publish`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ userId: user.id }),
                        });

                        if (!response.ok) {
                          const error = await response.json();
                          throw new Error(error.message || 'Failed to publish post');
                        }

                        toast({
                          title: "Post Published",
                          description: "Your post has been published successfully!",
                        });

                        window.dispatchEvent(new CustomEvent('postGenerated'));
                        onComplete?.(generatedContent);
                        onClose();
                      } catch (error: any) {
                        console.error('Publish error:', error);
                        toast({
                          title: "Publish Failed",
                          description: error.message || "Failed to publish post. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="w-full p-4 rounded-xl border-2 border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="h-5 w-5" />
                    <span className="text-sm font-semibold">Post Now</span>
                  </button>
                  <button 
                    onClick={() => setScheduleModalOpen(true)}
                    className="w-full p-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Schedule for Later</span>
                  </button>
                </div>
              </div>
            )}

            {/* Completion */}
            {isComplete && (
              <div className="text-center py-12 animate-in fade-in duration-300">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Generation Complete!
                </h3>
                <p className="text-sm text-gray-500">
                  Your content has been saved to drafts.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500">
              {currentStageIndex >= 0 && currentStageIndex < stages.length && (
                <>Stage {currentStageIndex + 1} of {stages.length}</>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="rounded-xl">
                Cancel
              </Button>
              
              {isInputStage && (
                <Button
                  onClick={startGeneration}
                  disabled={!inputValue.trim() || selectedPlatforms.length === 0}
                  className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Generation
                </Button>
              )}
              
              {isReviewStage && (
                <Button
                  onClick={completeReview}
                  className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
                >
                  Continue to Schedule
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {generatedPostId && (
        <SchedulePostModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          onSchedule={async (postId, date, time, utcISOString) => {
            if (!user) return;
            
            try {
              // Use provided UTC ISO string if available, otherwise convert
              let scheduledAt: string;
              if (utcISOString) {
                scheduledAt = utcISOString;
              } else {
                const timezone = getUserTimezone();
                const timeFormatted = time.length === 5 ? time : time.padStart(5, '0');
                scheduledAt = convertToUTC(date, timeFormatted, timezone);
              }
              
              const response = await fetch('/api/scheduler/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  postId: generatedPostId,
                  scheduledAt,
                }),
              });

              if (!response.ok) {
                throw new Error('Failed to schedule post');
              }

              toast({
                title: "Post Scheduled",
                description: `Your post has been scheduled for ${date} at ${time}.`,
              });
              
              setScheduleModalOpen(false);
              window.dispatchEvent(new CustomEvent('postGenerated'));
              onComplete?.(generatedContent);
              onClose();
            } catch (error: any) {
              console.error('Schedule error:', error);
              toast({
                title: "Schedule Failed",
                description: error.message || 'Failed to schedule post. Please try again.',
                variant: "destructive",
              });
            }
          }}
        />
      )}

      <PublishSuccessModal
        isOpen={publishSuccessOpen}
        onClose={() => {
          setPublishSuccessOpen(false);
          setPublishResults([]);
        }}
        results={publishResults}
        postTitle={generatedContent?.title}
      />
    </>
  );
}

