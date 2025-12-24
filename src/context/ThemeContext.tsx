'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    const updateTheme = (newTheme: Theme) => {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;
        
        const root = document.documentElement;
        
        // Force remove dark class first to ensure clean state
        root.classList.remove('dark');
        
        if (newTheme === 'dark') {
            // Add dark class to html element
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
            root.style.colorScheme = 'dark';
        } else {
            root.removeAttribute('data-theme');
            root.style.colorScheme = 'light';
        }
        
        // Force a reflow to ensure browser applies the changes
        void root.offsetHeight;
    };

    useEffect(() => {
        // Initialize theme immediately on mount
        const initializeTheme = () => {
            const savedTheme = localStorage.getItem('theme') as Theme | null;
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
            
            // Apply theme immediately to DOM
            updateTheme(initialTheme);
            
            // Update React state
            setTheme(initialTheme);
            setMounted(true);
        };
        
        initializeTheme();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        // Update localStorage first
        localStorage.setItem('theme', newTheme);
        
        // Apply to DOM immediately
        updateTheme(newTheme);
        
        // Update React state
        setTheme(newTheme);
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

