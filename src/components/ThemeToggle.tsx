'use client';

import { useEffect, useState } from 'react';

type ThemeToggleProps = {
  isMobile?: boolean;
};

export default function ThemeToggle({ isMobile = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // 初始化主题（基于系统设置）
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      // 检查本地存储中的主题设置
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      
      // 如果有保存的主题设置，使用它
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } 
      // 否则，检查系统偏好
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  // 防止水合不匹配
  if (!mounted) {
    return null;
  }

  // 移动端版本
  if (isMobile) {
    return (
      <button 
        onClick={toggleTheme}
        className="theme-toggle-mobile"
        aria-label={`切换到${theme === 'light' ? '暗色' : '亮色'}模式`}
      >
        <div className="toggle-icon-wrapper">
          {theme === 'light' ? (
            <svg className="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          ) : (
            <svg className="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          )}
        </div>
      </button>
    );
  }

  // 桌面端版本
  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`切换到${theme === 'light' ? '暗色' : '亮色'}模式`}
    >
      <div className="toggle-track">
        <div className={`toggle-thumb ${theme === 'dark' ? 'translate-x-full' : ''}`}>
          {theme === 'light' ? (
            <svg className="toggle-icon sun" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          ) : (
            <svg className="toggle-icon moon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          )}
        </div>
      </div>
      <span className="sr-only">{theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}</span>
    </button>
  );
}
