import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  responsive?: boolean;
}

const buttonVariants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white',
  ghost: 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs sm:text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  icon: 'p-2 w-10 h-10', // Square icon button for mobile
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  fullWidth = false,
  responsive = false,
  ...props
}) => {
  // Determine if we should show icon-only version for responsive buttons
  const shouldShowIconOnly = responsive && React.Children.count(children) === 0;
  const isIconButton = responsive && shouldShowIconOnly;
  
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        isIconButton ? buttonSizes.icon : buttonSizes[size],
        fullWidth && 'w-full',
        responsive && 'truncate', // Prevent text overflow
        className
      )}
      disabled={disabled || loading}
      title={isIconButton && children ? String(children) : undefined}
      {...props}
    >
      {loading ? (
        <Loader2 className={cn(
          "animate-spin", 
          children ? "mr-2" : "",
          isIconButton ? "w-4 h-4" : "w-4 h-4"
        )} />
      ) : leftIcon ? (
        <span className={cn(children ? "mr-2" : "", isIconButton ? "w-4 h-4" : "")}>
          {leftIcon}
        </span>
      ) : null}
      
      {/* Hide text on responsive icon buttons */}
      {!isIconButton && children}
      
      {!loading && rightIcon && !isIconButton && (
        <span className={cn(children ? "ml-2" : "")}>
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
};