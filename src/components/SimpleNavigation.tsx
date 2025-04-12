'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import SearchBox from './SearchBox';

type MenuItem = {
  id: number;
  name: string;
  url: string;
  isExternal: number;
  parentId: number | null;
  order: number;
  isActive: number;
};

type SimpleNavigationProps = {
  siteTitle?: string;
  menus?: MenuItem[];
};

const SimpleNavigation = ({ siteTitle, menus = [] }: SimpleNavigationProps) => {
  const [siteName, setSiteName] = useState(siteTitle || '向阳乔木的个人博客');

  // 从后台获取网站标题
  useEffect(() => {
    async function fetchSiteSettings() {
      try {
        const response = await fetch('/api/settings/general');
        if (response.ok) {
          const data = await response.json();
          if (data.siteName) {
            setSiteName(data.siteName);
          }
        }
      } catch (error) {
        console.error('获取网站设置失败:', error);
      }
    }

    // 只有当没有传入 siteTitle 时才从后台获取
    if (!siteTitle) {
      fetchSiteSettings();
    }
  }, [siteTitle]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMenus, setActiveMenus] = useState<Record<string, boolean>>({});

  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    // 确保组件卸载时清除事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 初始化主题设置
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      // 检查本地存储中的主题设置
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // 根据本地存储或系统偏好设置主题
      const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      setIsDarkMode(isDark);

      // 应用主题到文档
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // 处理主题切换
  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 切换菜单的展开/折叠状态
  const toggleMenu = useCallback((menuId: string) => {
    console.log(`尝试切换菜单: ${menuId}, 当前状态:`, activeMenus[menuId] ? '已展开' : '已折叠');

    setActiveMenus(prev => {
      const newState = {
        ...prev,
        [menuId]: !prev[menuId]
      };

      // 打印详细的调试信息
      console.log(`菜单切换后: ${menuId}, 新状态:`, newState[menuId] ? '展开' : '折叠');
      console.log('当前所有菜单状态:', newState);

      // 尝试获取对应的DOM元素
      setTimeout(() => {
        const menuElement = document.getElementById(menuId);
        if (menuElement) {
          console.log(`找到菜单元素 ${menuId}, 当前类名:`, menuElement.className);
        } else {
          console.warn(`未找到菜单元素 ${menuId}`);
        }
      }, 0);

      return newState;
    });
  }, [activeMenus]);

  return (
    <>
      <header className="header">
        <div className="container-wide max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="site-logo text-2xl">{siteName}</Link>

            {/* 桌面端导航 */}
            <nav className="desktop-menu hidden md:flex items-center space-x-4">
              <Link href="/" className="nav-link">首页</Link>

              {/* 菜单项 */}
              {menus.filter(menu => !menu.parentId).map(menu => {
                // 查找子菜单
                const subMenus = menus.filter(subMenu => subMenu.parentId === menu.id);

                if (subMenus.length > 0) {
                  return (
                    <div key={menu.id} className="dropdown">
                      <Link href={menu.url} className="nav-link flex items-center">
                        {menu.name}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      <div className="dropdown-menu">
                        {subMenus.map(subMenu => {
                          // 查找三级菜单
                          const thirdLevelMenus = menus.filter(thirdMenu => thirdMenu.parentId === subMenu.id);

                          if (thirdLevelMenus.length > 0) {
                            return (
                              <div key={subMenu.id} className="dropdown-submenu">
                                <div className="dropdown-item flex items-center justify-between">
                                  <Link href={subMenu.url}>{subMenu.name}</Link>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                                <div className="dropdown-submenu-menu">
                                  {thirdLevelMenus.map(thirdMenu => (
                                    <Link
                                      key={thirdMenu.id}
                                      href={thirdMenu.url}
                                      className="dropdown-item"
                                    >
                                      {thirdMenu.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <Link
                                key={subMenu.id}
                                href={subMenu.url}
                                className="dropdown-item"
                              >
                                {subMenu.name}
                              </Link>
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <Link key={menu.id} href={menu.url} className="nav-link">
                      {menu.name}
                    </Link>
                  );
                }
              })}

              {/* 搜索框 */}
              <SearchBox />

              {/* 主题切换按钮 */}
              <button onClick={toggleTheme} className="nav-link">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 theme-light ${isDarkMode ? 'hidden' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 theme-dark ${isDarkMode ? '' : 'hidden'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>

            {/* 移动端菜单按钮 */}
            <button
              className="mobile-menu-toggle md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 移动端菜单 - 完全重写版本 */}
      {/* 开发环境调试信息 */}
      {process.env.NODE_ENV === 'development' && mobileMenuOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-900 p-2 text-xs z-50 max-h-32 overflow-auto">
          <div className="font-mono">
            <div><strong>菜单状态调试信息:</strong></div>
            <pre>{JSON.stringify(activeMenus, null, 2)}</pre>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-gray-800 z-40 overflow-y-auto p-4 md:hidden">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold">{siteTitle}</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="关闭菜单"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {/* 移动端搜索框 */}
            <div className="mb-4">
              <SearchBox isMobile={true} onClose={() => setMobileMenuOpen(false)} />
            </div>

            {/* 首页链接 */}
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              首页
            </Link>

            {/* 渲染一级菜单 */}
            {menus.filter(menu => !menu.parentId).map(menu => {
              // 查找子菜单
              const subMenus = menus.filter(subMenu => subMenu.parentId === menu.id);
              const menuId = `menu-${menu.id}`;

              if (subMenus.length > 0) {
                return (
                  <div key={menu.id} className="space-y-1">
                    <button
                      className={`flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${activeMenus[menuId] ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                      onClick={() => toggleMenu(menuId)}
                      aria-expanded={activeMenus[menuId] ? 'true' : 'false'}
                      aria-controls={menuId}
                    >
                      <span>{menu.name}</span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${activeMenus[menuId] ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* 子菜单容器 */}
                    <div
                      id={menuId}
                      className={`pl-4 ml-2 border-l-2 border-gray-200 dark:border-gray-700 space-y-1 overflow-hidden transition-all duration-300 ${activeMenus[menuId] ? 'max-h-[1000px] py-1' : 'max-h-0'}`}
                    >
                      {subMenus.map(subMenu => {
                        // 查找三级菜单
                        const thirdLevelMenus = menus.filter(thirdMenu => thirdMenu.parentId === subMenu.id);
                        const subMenuId = `submenu-${subMenu.id}`;

                        if (thirdLevelMenus.length > 0) {
                          return (
                            <div key={subMenu.id} className="space-y-1 mt-1">
                              <button
                                className={`flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${activeMenus[subMenuId] ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                onClick={() => toggleMenu(subMenuId)}
                                aria-expanded={activeMenus[subMenuId] ? 'true' : 'false'}
                                aria-controls={subMenuId}
                              >
                                <span>{subMenu.name}</span>
                                <svg
                                  className={`w-5 h-5 transition-transform duration-300 ${activeMenus[subMenuId] ? 'rotate-180' : ''}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>

                              {/* 三级菜单容器 */}
                              <div
                                id={subMenuId}
                                className={`pl-4 ml-2 border-l-2 border-gray-200 dark:border-gray-700 space-y-1 overflow-hidden transition-all duration-300 ${activeMenus[subMenuId] ? 'max-h-[1000px] py-1' : 'max-h-0'}`}
                              >
                                {thirdLevelMenus.map(thirdMenu => (
                                  <Link
                                    key={thirdMenu.id}
                                    href={thirdMenu.url}
                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {thirdMenu.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <Link
                              key={subMenu.id}
                              href={subMenu.url}
                              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subMenu.name}
                            </Link>
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              } else {
                return (
                  <Link
                    key={menu.id}
                    href={menu.url}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {menu.name}
                  </Link>
                );
              }
            })}

            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full mt-4"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
              切换主题
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default SimpleNavigation;
