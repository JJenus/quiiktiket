import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '../../lib/utils';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search events, attendees...",
  className = "",
  onSearch,
  onFocusChange,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce((value: string) => {
      onSearch?.(value);
    }, 300)
  ).current;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Auto-focus when expanded on mobile
  useEffect(() => {
    if (isExpanded && isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded, isMobile]);

  // Handle search query changes
  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    }
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleFocus = () => {
    setIsSearchFocused(true);
    setIsExpanded(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsSearchFocused(false);
    onFocusChange?.(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
    if (isMobile && inputRef.current) {
      inputRef.current.blur(); // Blur input after submission on mobile
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsExpanded(isMobile ? false : true); // Collapse on mobile only
    if (inputRef.current) {
      inputRef.current.focus();
    }
    onSearch?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (query) {
        clearSearch();
      } else if (isMobile) {
        setIsExpanded(false);
        onFocusChange?.(false);
      }
    }
  };

  const expandSearch = () => {
    setIsExpanded(true);
  };

  // Render collapsed search icon on mobile
  if (isMobile && !isExpanded) {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={expandSearch}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Open search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center transition-all duration-300 ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex w-full items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full transition-all placeholder-gray-400"
          aria-label="Search"
        />
        {(isSearchFocused || query) && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;