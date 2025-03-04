"use client"
import React, { useState, useRef } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  id: string;
  label: string;
  error?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  previewType?: 'image' | 'document';
}

const FileUpload = ({
  accept = 'image/jpeg,application/pdf',
  maxSize = 5, // Default 5MB
  id,
  label,
  error,
  value,
  onChange,
  previewType = 'document'
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert maxSize from MB to bytes
  const maxSizeBytes = maxSize * 1024 * 1024;

  const handleFileChange = (file: File | null) => {
    if (!file) {
      onChange(null);
      setFileError(null);
      return;
    }

    // Validate file type
    const fileType = file.type;
    const acceptedTypes = accept.split(',');
    const isValidType = acceptedTypes.some(type => fileType === type);

    if (!isValidType) {
      setFileError(`Invalid file type. Please upload ${accept.replace(/,/g, ' or ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      setFileError(`File is too large. Maximum size is ${maxSize}MB`);
      return;
    }

    setFileError(null);
    onChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const renderPreview = () => {
    if (!value) return null;

    if (previewType === 'image' && value.type.startsWith('image/')) {
      return (
        <div className="relative w-full h-32 mb-3">
          <img
            src={URL.createObjectURL(value)}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3">
        <div className="flex items-center flex-1 overflow-hidden">
          <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{value.name}</span>
        </div>
        <button
          type="button"
          onClick={removeFile}
          className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      
      {renderPreview()}
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer text-center",
          isDragging 
            ? "border-medical-lightBlue bg-blue-50 dark:bg-blue-900/20" 
            : "border-gray-300 hover:border-medical-lightBlue dark:border-gray-700",
          error || fileError ? "border-medical-error" : ""
        )}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag and drop your file here or <span className="text-medical-lightBlue">browse</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {accept.includes('image/jpeg') && accept.includes('application/pdf') 
            ? 'JPG or PDF' 
            : accept.includes('image/jpeg') 
              ? 'JPG only' 
              : 'PDF only'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Max size: {maxSize}MB
        </p>
      </div>
      
      {(error || fileError) && (
        <div className="form-error flex items-center mt-2">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{error || fileError}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
