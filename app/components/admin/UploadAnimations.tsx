'use client';

import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-amber-200 border-t-amber-600"></div>
    </div>
  );
};

interface SuccessCheckmarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export const SuccessCheckmark = ({ size = 'md', className = '', animate = true }: SuccessCheckmarkProps) => {
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <div 
        className={`
          absolute inset-0 rounded-full bg-green-500 flex items-center justify-center
          transition-all duration-300 ease-out
          ${visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        `}
      >
        <svg 
          className="w-3/4 h-3/4 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3} 
            d="M5 13l4 4L19 7"
            className={animate ? 'animate-pulse' : ''}
          />
        </svg>
      </div>
    </div>
  );
};

interface ErrorIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ErrorIcon = ({ size = 'md', className = '' }: ErrorIconProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center">
        <svg 
          className="w-3/4 h-3/4 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </div>
    </div>
  );
};

interface UploadProgressProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UploadProgress = ({ progress, size = 'md', className = '' }: UploadProgressProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const radius = size === 'sm' ? 24 : size === 'md' ? 30 : 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${radius * 2 + 8} ${radius * 2 + 8}`}>
        {/* Background circle */}
        <circle
          cx={radius + 4}
          cy={radius + 4}
          r={radius}
          className="fill-none stroke-amber-200"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <circle
          cx={radius + 4}
          cy={radius + 4}
          r={radius}
          className="fill-none stroke-amber-600 transition-all duration-300 ease-out"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-amber-700">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface UploadIndicatorProps {
  state: UploadState;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  errorMessage?: string;
  successMessage?: string;
}

export const UploadIndicator = ({ 
  state, 
  progress = 0, 
  size = 'md', 
  className = '',
  errorMessage,
  successMessage
}: UploadIndicatorProps) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (state === 'success' || state === 'error') {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {/* Main indicator */}
      <div className="relative">
        {state === 'idle' && (
          <div className="opacity-0"></div>
        )}
        {state === 'uploading' && (
          <>
            <LoadingSpinner size={size} />
            {progress > 0 && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <span className="text-xs text-amber-600">{Math.round(progress)}%</span>
              </div>
            )}
          </>
        )}
        {state === 'success' && (
          <SuccessCheckmark size={size} animate={true} />
        )}
        {state === 'error' && (
          <ErrorIcon size={size} />
        )}
      </div>

      {/* Messages */}
      {showMessage && (
        <div 
          className={`
            transition-all duration-300 ease-out text-xs text-center max-w-xs
            ${state === 'success' ? 'text-green-600' : state === 'error' ? 'text-red-600' : ''}
          `}
        >
          {state === 'success' && (successMessage || 'Subido exitosamente')}
          {state === 'error' && (errorMessage || 'Error al subir archivo')}
        </div>
      )}

      {/* Uploading message */}
      {state === 'uploading' && (
        <div className="text-xs text-amber-600 animate-pulse">
          Subiendo archivo...
        </div>
      )}
    </div>
  );
};

interface AnimatedUploadZoneProps {
  isDragging?: boolean;
  isUploading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const AnimatedUploadZone = ({ 
  isDragging = false, 
  isUploading = false, 
  children, 
  className = '' 
}: AnimatedUploadZoneProps) => {
  return (
    <div 
      className={`
        relative transition-all duration-200 ease-out
        ${isDragging ? 'scale-105 border-amber-400 bg-amber-50' : ''}
        ${isUploading ? 'pointer-events-none opacity-75' : ''}
        ${className}
      `}
    >
      {isUploading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
          <LoadingSpinner size="lg" />
        </div>
      )}
      {children}
    </div>
  );
};