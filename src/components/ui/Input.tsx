import React, { useState, useId, forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

// Extend InputProps to include motion-specific props
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onAnimationStart'> {
  label?: string;
  error?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps & MotionProps>(({
  label,
  error,
  success,
  leftIcon,
  rightIcon,
  helperText,
  variant = 'default',
  fullWidth = true,
  className,
  type,
  id,
  disabled,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;

  const isPassword = type === 'password';
  const showToggle = isPassword && props.value;
  const inputType = isPassword && showPassword ? 'text' : type;

  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return cn(
          'bg-gray-50 border-0 border-b-2 border-gray-300 focus:border-indigo-600',
          'dark:bg-gray-800 dark:border-gray-600 dark:focus:border-indigo-400',
          error && 'border-red-500 focus:border-red-500',
          success && 'border-green-500 focus:border-green-500'
        );
      case 'outlined':
        return cn(
          'bg-transparent border-2 border-gray-300 focus:border-indigo-600',
          'dark:border-gray-600 dark:focus:border-indigo-400',
          error && 'border-red-500 focus:border-red-500',
          success && 'border-green-500 focus:border-green-500'
        );
      default:
        return cn(
          'border border-gray-300 focus:border-indigo-600',
          'dark:border-gray-600 dark:focus:border-indigo-400',
          error && 'border-red-500 focus:border-red-500',
          success && 'border-green-500 focus:border-green-500'
        );
    }
  };

  return (
    <div className={cn('space-y-1', fullWidth && 'w-full')}>
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={cn(
              "text-gray-400 transition-colors",
              isFocused && "text-indigo-600 dark:text-indigo-400",
              error && "text-red-500",
              success && "text-green-500"
            )}>
              {leftIcon}
            </span>
          </div>
        )}
        
        {/* Input Field */}
        <motion.input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          className={cn(
            'block w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
            'dark:bg-gray-800 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            disabled && 'opacity-60 cursor-not-allowed',
            leftIcon && 'pl-10',
            (rightIcon || showToggle) && 'pr-10',
            getVariantClasses(),
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* Right Icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
          {/* Success/Error Icons */}
          {success && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-green-500"
            >
              <CheckCircle className="w-4 h-4" />
            </motion.span>
          )}
          
          {error && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-red-500"
            >
              <AlertCircle className="w-4 h-4" />
            </motion.span>
          )}

          {/* Password Toggle */}
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Custom Right Icon */}
          {rightIcon && !isPassword && (
            <span className="text-gray-400">{rightIcon}</span>
          )}
        </div>
      </div>
      
      {/* Helper Text and Error Messages */}
      {(error || success || helperText) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-0.5"
        >
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </motion.p>
          )}
          
          {success && (
            <motion.p
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-green-600 dark:text-green-400"
            >
              {success}
            </motion.p>
          )}
          
          {helperText && !error && !success && (
            <motion.p
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              {helperText}
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
});

Input.displayName = 'Input';