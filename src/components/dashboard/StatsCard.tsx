import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  compact?: boolean;
  loading?: boolean;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    trendUp: 'text-blue-600 dark:text-blue-400',
    trendDown: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    trendUp: 'text-green-600 dark:text-green-400',
    trendDown: 'text-green-600 dark:text-green-400',
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    trendUp: 'text-yellow-600 dark:text-yellow-400',
    trendDown: 'text-yellow-600 dark:text-yellow-400',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    trendUp: 'text-red-600 dark:text-red-400',
    trendDown: 'text-red-600 dark:text-red-400',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    trendUp: 'text-purple-600 dark:text-purple-400',
    trendDown: 'text-purple-600 dark:text-purple-400',
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    trendUp: 'text-indigo-600 dark:text-indigo-400',
    trendDown: 'text-indigo-600 dark:text-indigo-400',
  },
};

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
  </div>
);

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  compact = false,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card hover className={`p-4 ${compact ? 'h-28' : 'h-32'}`}>
        <SkeletonLoader />
      </Card>
    );
  }

  return (
    <Card hover className={`p-4 ${compact ? 'h-28' : 'h-32'} transition-all duration-300`}>
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate"
            title={title}
          >
            {title}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="mt-1"
          >
            <p className={`font-bold text-gray-900 dark:text-white truncate ${
              compact ? 'text-2xl' : 'text-3xl'
            }`}>
              {value}
            </p>
          </motion.div>
          
          {change && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="flex items-center mt-2 space-x-1"
            >
              {change.type === 'increase' ? (
                <TrendingUp className={`w-4 h-4 ${colorVariants[color].trendUp}`} />
              ) : (
                <TrendingDown className={`w-4 h-4 ${colorVariants[color].trendDown}`} />
              )}
              <span
                className={`text-sm font-medium ${
                  change.type === 'increase' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {change.period}
              </span>
            </motion.div>
          )}
        </div>
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={`p-3 rounded-lg ${colorVariants[color].bg} ${colorVariants[color].text} flex-shrink-0 ${
            compact ? 'p-2' : 'p-3'
          }`}
        >
          <Icon className={compact ? 'w-5 h-5' : 'w-6 h-6'} />
        </motion.div>
      </div>
    </Card>
  );
};