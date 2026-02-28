'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleChange = useCallback(
        (value: string) => {
            setQuery(value);

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                onSearch(value);
            }, 300);
        },
        [onSearch]
    );

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
        >
            <div
                className={`relative flex items-center rounded-2xl transition-all duration-300 ${isFocused
                        ? 'bg-white/15 border-white/30 shadow-lg shadow-purple-500/10'
                        : 'bg-white/8 border-white/10 hover:bg-white/12'
                    } border backdrop-blur-xl`}
            >
                <svg
                    className="absolute left-4 w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search movies..."
                    className="w-full bg-transparent pl-12 pr-4 py-3.5 text-white placeholder-gray-500 text-sm focus:outline-none"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            onSearch('');
                        }}
                        className="absolute right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </motion.div>
    );
}
