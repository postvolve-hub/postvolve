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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { SchedulePostModal } from "@/components/dashboard/SchedulePostModal";
import { useAuth } from "@/hooks/use-auth";
import { PLACEHOLDER_IMAGES } from "@/lib/image-placeholder";

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

export function GenerationPipeline({ isOpen, onClose, onComplete }: GenerationPipelineProps) {
  const { user } = useAuth();
  const [selectedLane, setSelectedLane] = useState<GenerationLane>("url");
  const [inputValue, setInputValue] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
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
    }
  }, [isOpen]);

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
            platforms: ['linkedin', 'x', 'facebook', 'instagram'],
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
            platforms: ['linkedin', 'x', 'facebook', 'instagram'],
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

                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setScheduleModalOpen(true)}
                    className="p-6 rounded-xl border-2 border-[#6D28D9] bg-[#6D28D9]/5 text-center hover:bg-[#6D28D9]/10 transition-colors"
                  >
                    <Calendar className="h-8 w-8 text-[#6D28D9] mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">Schedule for Later</span>
                    <p className="text-xs text-gray-500 mt-1">Pick date & time</p>
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
                    className="p-6 rounded-xl border-2 border-blue-500 bg-blue-50 text-center hover:bg-blue-100 transition-colors"
                  >
                    <Play className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">Post Now</span>
                    <p className="text-xs text-gray-500 mt-1">Publish immediately</p>
                  </button>
                  <button 
                    onClick={finishGeneration}
                    className="p-6 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-center hover:bg-emerald-100 transition-colors"
                  >
                    <Play className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">Save as Draft</span>
                    <p className="text-xs text-gray-500 mt-1">Review later</p>
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
                  disabled={!inputValue.trim()}
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
          onSchedule={async (postId, date, time) => {
            if (!user) return;
            
            try {
              // Combine date and time into ISO string
              // Ensure time is in HH:MM format (24-hour)
              const timeFormatted = time.length === 5 ? time : time.padStart(5, '0');
              const scheduledAt = new Date(`${date}T${timeFormatted}:00`).toISOString();
              
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
    </>
  );
}

