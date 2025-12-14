"use client";

import { useState, useRef, useCallback } from "react";
import { 
  X, 
  Upload, 
  Link2, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Check,
  Trash2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

type UploadMode = "file" | "url" | "ai";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (imageUrl: string) => void;
  currentImage?: string;
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  currentImage,
}: ImageUploadModalProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<UploadMode>("file");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setError(null);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setError(null);
    setPreviewUrl(imageUrl);
  };

  const handleAIGenerate = async () => {
    if (!imageUrl.trim()) {
      setError("Please enter a prompt or description for image generation");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: imageUrl,
          quality: 'high',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate image');
      }

      const result = await response.json();
      
      if (result.success && result.image?.imageUrl) {
        setPreviewUrl(result.image.imageUrl);
        toast({
          title: "Image Generated",
          description: "Your AI-generated image is ready!",
        });
      } else {
        throw new Error('No image URL returned');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      setError(error.message || 'Failed to generate image');
      toast({
        title: "Error",
        description: error.message || "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) return;
    if (!user) {
      setError("Please sign in to upload images");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      let finalImageUrl = previewUrl;

      // If file mode and we have a selected file, upload it
      if (mode === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('userId', user.id);

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to upload image');
        }

        const result = await response.json();
        if (result.success && result.imageUrl) {
          finalImageUrl = result.imageUrl;
        } else {
          throw new Error('Upload failed - no image URL returned');
        }
      }
      // For URL mode, use the URL directly
      // For AI mode, previewUrl is already set from generation

      onUpload?.(finalImageUrl);
      toast({
        title: "Image Updated",
        description: "Your post image has been updated successfully.",
      });
      handleClose();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Failed to upload image');
      toast({
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setMode("file");
    setImageUrl("");
    setPreviewUrl(null);
    setError(null);
    setIsDragging(false);
    setIsUploading(false);
    setIsGenerating(false);
    onClose();
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setImageUrl("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
                <ImageIcon className="h-5 w-5 text-[#6D28D9]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upload Image</h2>
                <p className="text-xs text-gray-500">Add or change the post image</p>
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
          <div className="p-6">
            {/* Mode Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
              <button
                onClick={() => setMode("file")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === "file"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Upload className="h-4 w-4" />
                Upload
              </button>
              <button
                onClick={() => setMode("url")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === "url"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Link2 className="h-4 w-4" />
                URL
              </button>
              <button
                onClick={() => setMode("ai")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === "ai"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <RefreshCw className="h-4 w-4" />
                AI Generate
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Preview */}
            {previewUrl && (
              <div className="mb-6 relative">
                <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setError("Failed to load image")}
                  />
                </div>
                <button
                  onClick={clearPreview}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Upload Modes */}
            {!previewUrl && (
              <>
                {/* File Upload */}
                {mode === "file" && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      isDragging
                        ? "border-[#6D28D9] bg-[#6D28D9]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      Drag and drop an image here, or
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-[#6D28D9] font-medium hover:underline"
                    >
                      browse to upload
                    </button>
                    <p className="text-xs text-gray-400 mt-3">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}

                {/* URL Input */}
                {mode === "url" && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-700">Image URL</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="rounded-xl flex-1"
                        />
                        <Button
                          onClick={handleUrlSubmit}
                          className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
                        >
                          Load
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Enter the direct URL to an image file
                    </p>
                  </div>
                )}

                {/* AI Generate */}
                {mode === "ai" && (
                  <div className="text-center py-6">
                    {isGenerating ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-full bg-[#6D28D9]/10 flex items-center justify-center mx-auto">
                          <Loader2 className="h-8 w-8 text-[#6D28D9] animate-spin" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Generating image...</p>
                          <p className="text-xs text-gray-500 mt-1">This may take a few seconds</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Generate a new image using AI based on your post content
                        </p>
                        <Button
                          onClick={handleAIGenerate}
                          className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate New Image
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Current Image */}
            {currentImage && !previewUrl && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Label className="text-sm text-gray-700 mb-2 block">Current Image</Label>
                <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={currentImage}
                    alt="Current"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-black/50 text-white text-xs rounded-full">
                      Current Image
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <Button variant="outline" onClick={handleClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!previewUrl || isUploading}
              className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Use This Image
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

