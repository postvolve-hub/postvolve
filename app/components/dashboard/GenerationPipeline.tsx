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

type StageStatus = "pending" | "processing" | "completed" | "error" | "skipped";
type GenerationLane = "url" | "prompt" | "upload";

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
  const [selectedLane, setSelectedLane] = useState<GenerationLane>("url");
  const [inputValue, setInputValue] = useState("");
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    content: string;
    imageUrl: string;
  } | null>(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStages(INITIAL_STAGES);
      setCurrentStageIndex(-1);
      setIsGenerating(false);
      setOverallProgress(0);
      setInputValue("");
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
      // Stage 1: Content Extraction (skip for prompt lane)
      if (selectedLane === "url") {
        await simulateStage(1, 2000);
      } else {
        updateStage(1, { status: "skipped" });
        setOverallProgress(25);
      }
      
      // Stage 2: AI Processing
      await simulateStage(2, 3000);
      
      // Stage 3: Image Generation
      await simulateStage(3, 2500);
      
      // Set generated content
      setGeneratedContent({
        title: "AI-Generated Post Title",
        content: "This is the AI-generated content based on your input. It has been optimized for engagement and formatted for your selected platforms.",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      });
      
      // Stage 4: Review
      updateStage(4, { status: "processing" });
      setCurrentStageIndex(4);
      setOverallProgress(85);
      
    } catch (error) {
      updateStage(currentStageIndex, { 
        status: "error", 
        error: "Generation failed. Please try again." 
      });
    }
  };

  const completeReview = () => {
    updateStage(4, { status: "completed" });
    updateStage(5, { status: "processing" });
    setCurrentStageIndex(5);
    setOverallProgress(95);
  };

  const finishGeneration = () => {
    updateStage(5, { status: "completed" });
    setOverallProgress(100);
    setCurrentStageIndex(6);
    
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
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedLane("url")}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                        selectedLane === "url"
                          ? "border-[#6D28D9] bg-[#6D28D9]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Link2 className={`h-6 w-6 mx-auto mb-2 ${
                        selectedLane === "url" ? "text-[#6D28D9]" : "text-gray-500"
                      }`} />
                      <span className="text-sm font-medium text-gray-700">From URL</span>
                      <p className="text-[10px] text-gray-400 mt-1">Extract from article</p>
                    </button>
                    <button
                      onClick={() => setSelectedLane("prompt")}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                        selectedLane === "prompt"
                          ? "border-[#6D28D9] bg-[#6D28D9]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <MessageSquare className={`h-6 w-6 mx-auto mb-2 ${
                        selectedLane === "prompt" ? "text-[#6D28D9]" : "text-gray-500"
                      }`} />
                      <span className="text-sm font-medium text-gray-700">Custom Prompt</span>
                      <p className="text-[10px] text-gray-400 mt-1">Describe your post</p>
                    </button>
                    <button
                      onClick={() => setSelectedLane("upload")}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                        selectedLane === "upload"
                          ? "border-[#6D28D9] bg-[#6D28D9]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Upload className={`h-6 w-6 mx-auto mb-2 ${
                        selectedLane === "upload" ? "text-[#6D28D9]" : "text-gray-500"
                      }`} />
                      <span className="text-sm font-medium text-gray-700">Upload File</span>
                      <p className="text-[10px] text-gray-400 mt-1">PDF, DOC, TXT</p>
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
                    <>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Content Prompt
                      </Label>
                      <Textarea
                        placeholder="Describe the content you want to create..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="rounded-xl min-h-[120px]"
                      />
                    </>
                  )}
                  {selectedLane === "upload" && (
                    <>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Upload Document
                      </Label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#6D28D9]/50 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Drag and drop or click to upload
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Supports PDF, DOC, DOCX, TXT
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setInputValue(file.name);
                          }}
                        />
                      </div>
                    </>
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
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={generatedContent.imageUrl}
                        alt="Generated"
                        className="w-full h-40 object-cover"
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

                <div className="grid grid-cols-2 gap-4">
                  <button className="p-6 rounded-xl border-2 border-[#6D28D9] bg-[#6D28D9]/5 text-center hover:bg-[#6D28D9]/10 transition-colors">
                    <Calendar className="h-8 w-8 text-[#6D28D9] mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">Schedule for Later</span>
                    <p className="text-xs text-gray-500 mt-1">Pick date & time</p>
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
    </>
  );
}

