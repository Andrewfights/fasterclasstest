import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ArtworkUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  aspectRatio?: '16:9' | '1:1' | '4:3' | '2:3';
  label?: string;
  placeholder?: string;
  maxSizeKB?: number;
  className?: string;
}

const aspectRatioClasses: Record<string, string> = {
  '16:9': 'aspect-video',
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '2:3': 'aspect-[2/3]',
};

const aspectRatioLabels: Record<string, string> = {
  '16:9': '16:9 (Video)',
  '1:1': '1:1 (Square)',
  '4:3': '4:3 (Photo)',
  '2:3': '2:3 (Poster)',
};

export const ArtworkUploader: React.FC<ArtworkUploaderProps> = ({
  value,
  onChange,
  aspectRatio = '16:9',
  label,
  placeholder = 'Drop image here or click to upload',
  maxSizeKB = 2048,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateAndProcessFile = useCallback(async (file: File): Promise<string | null> => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return null;
    }

    // Validate file size
    if (file.size > maxSizeKB * 1024) {
      setError(`File size must be under ${maxSizeKB}KB`);
      return null;
    }

    // Convert to base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  }, [maxSizeKB]);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    const result = await validateAndProcessFile(file);
    setIsLoading(false);

    if (result) {
      onChange(result);
    }
  }, [validateAndProcessFile, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError(null);
  }, [onChange]);

  const handlePasteUrl = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      // Basic URL validation
      try {
        new URL(url);
        onChange(url);
        setError(null);
      } catch {
        setError('Invalid URL');
      }
    }
  }, [onChange]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white mb-1">
          {label}
          <span className="text-white/50 ml-2 text-xs">
            ({aspectRatioLabels[aspectRatio]})
          </span>
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-xl overflow-hidden
          border-2 border-dashed transition-all
          ${aspectRatioClasses[aspectRatio]}
          ${isDragging
            ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
            : value
              ? 'border-transparent'
              : 'border-[#3E3E4E] hover:border-[#8B5CF6]/50 bg-[#1E1E2E]'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded artwork"
              className="w-full h-full object-cover"
              onError={() => setError('Failed to load image')}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={handleClick}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Replace"
              >
                <Upload className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleRemove}
                className="p-2 bg-red-500/50 hover:bg-red-500 rounded-lg transition-colors"
                title="Remove"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-[#6B7280] mb-2" />
                <p className="text-sm text-[#9CA3AF]">{placeholder}</p>
                <p className="text-xs text-[#6B7280] mt-1">
                  Max {maxSizeKB}KB - {aspectRatioLabels[aspectRatio]}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleClick}
          className="flex-1 px-3 py-1.5 bg-[#2E2E3E] hover:bg-[#3E3E4E] text-white text-sm rounded-lg transition-colors"
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={handlePasteUrl}
          className="flex-1 px-3 py-1.5 bg-[#2E2E3E] hover:bg-[#3E3E4E] text-white text-sm rounded-lg transition-colors"
        >
          Paste URL
        </button>
      </div>
    </div>
  );
};

export default ArtworkUploader;
