'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import SearchBox from './SearchBox';
import ThemeToggle from './ThemeToggle';

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

    fetchSiteSettings();
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenus, setActiveMenus] = useState<Record<string, boolean>>({});

  // 切换子菜单的显示状态
  const toggleSubmenu = useCallback((menuId: string) => {
    setActiveMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  }, []);

  // 关闭所有子菜单
  useEffect(() => {
    if (!mobileMenuOpen) {
      setActiveMenus({});
    }
  }, [mobileMenuOpen]);

  return (
    <div>
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
                      {menu.isExternal ? (
                        <a
                          href={menu.url}
                          className="nav-link flex items-center"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {menu.name}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </a>
                      ) : (
                        <Link href={menu.url} className="nav-link flex items-center">
                          {menu.name}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </Link>
                      )}

                      <div className="dropdown-menu">
                        {subMenus.map(subMenu => {
                          // 查找三级菜单
                          const thirdLevelMenus = menus.filter(thirdMenu => thirdMenu.parentId === subMenu.id);

                          if (thirdLevelMenus.length > 0) {
                            return (
                              <div key={subMenu.id} className="dropdown-submenu">
                                <div className="dropdown-submenu-trigger">
                                  {subMenu.name}
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                                <div className="dropdown-submenu-menu">
                                  {thirdLevelMenus.map(thirdMenu => (
                                    thirdMenu.isExternal ? (
                                      <a
                                        key={thirdMenu.id}
                                        href={thirdMenu.url}
                                        className="dropdown-item"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {thirdMenu.name}
                                      </a>
                                    ) : (
                                      <Link
                                        key={thirdMenu.id}
                                        href={thirdMenu.url}
                                        className="dropdown-item"
                                      >
                                        {thirdMenu.name}
                                      </Link>
                                    )
                                  ))}
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              subMenu.isExternal ? (
                                <a
                                  key={subMenu.id}
                                  href={subMenu.url}
                                  className="dropdown-item"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {subMenu.name}
                                </a>
                              ) : (
                                <Link
                                  key={subMenu.id}
                                  href={subMenu.url}
                                  className="dropdown-item"
                                >
                                  {subMenu.name}
                                </Link>
                              )
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    menu.isExternal ? (
                      <a
                        key={menu.id}
                        href={menu.url}
                        className="nav-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {menu.name}
                      </a>
                    ) : (
                      <Link key={menu.id} href={menu.url} className="nav-link">
                        {menu.name}
                      </Link>
                    )
                  );
                }
              })}

              {/* 搜索框 */}
              <SearchBox />

              {/* 主题切换按钮 */}
              <ThemeToggle />
            </nav>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端菜单 */}
      <div
        className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-75 transition-opacity ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl transition-transform transform ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">菜单</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* 移动端搜索框 */}
          <div className="p-4 border-b dark:border-gray-700">
            <SearchBox isMobile={true} onClose={() => setMobileMenuOpen(false)} />
          </div>

          <div className="p-4 overflow-y-auto">
            <nav className="space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                首页
              </Link>

              {/* 移动端菜单项 */}
              {menus.filter(menu => !menu.parentId).map(menu => {
                // 查找子菜单
                const subMenus = menus.filter(subMenu => subMenu.parentId === menu.id);

                if (subMenus.length > 0) {
                  const menuId = `mobile-menu-${menu.id}`;
                  return (
                    <div key={menu.id} className="space-y-1">
                      <button
                        onClick={() => toggleSubmenu(menuId)}
                        className="w-full flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <span>{menu.name}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 transition-transform ${
                            activeMenus[menuId] ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        className={`pl-4 ml-2 border-l-2 border-gray-200 dark:border-gray-700 space-y-1 overflow-hidden transition-all duration-300 ${
                          activeMenus[menuId] ? 'max-h-[1000px] py-1' : 'max-h-0'
                        }`}
                      >
                        {subMenus.map(subMenu => {
                          // 查找三级菜单
                          const thirdLevelMenus = menus.filter(thirdMenu => thirdMenu.parentId === subMenu.id);
                          const subMenuId = `mobile-submenu-${subMenu.id}`;

                          if (thirdLevelMenus.length > 0) {
                            return (
                              <div key={subMenu.id} className="space-y-1">
                                <button
                                  onClick={() => toggleSubmenu(subMenuId)}
                                  className="w-full flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                  <span>{subMenu.name}</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 transition-transform ${
                                      activeMenus[subMenuId] ? 'transform rotate-180' : ''
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                                <div
                                  id={subMenuId}
                                  className={`pl-4 ml-2 border-l-2 border-gray-200 dark:border-gray-700 space-y-1 overflow-hidden transition-all duration-300 ${activeMenus[subMenuId] ? 'max-h-[1000px] py-1' : 'max-h-0'}`}
                                >
                                  {thirdLevelMenus.map(thirdMenu => (
                                    thirdMenu.isExternal ? (
                                      <a
                                        key={thirdMenu.id}
                                        href={thirdMenu.url}
                                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                        onClick={() => setMobileMenuOpen(false)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {thirdMenu.name}
                                      </a>
                                    ) : (
                                      <Link
                                        key={thirdMenu.id}
                                        href={thirdMenu.url}
                                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {thirdMenu.name}
                                      </Link>
                                    )
                                  ))}
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              subMenu.isExternal ? (
                                <a
                                  key={subMenu.id}
                                  href={subMenu.url}
                                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                  onClick={() => setMobileMenuOpen(false)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {subMenu.name}
                                </a>
                              ) : (
                                <Link
                                  key={subMenu.id}
                                  href={subMenu.url}
                                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {subMenu.name}
                                </Link>
                              )
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    menu.isExternal ? (
                      <a
                        key={menu.id}
                        href={menu.url}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {menu.name}
                      </a>
                    ) : (
                      <Link
                        key={menu.id}
                        href={menu.url}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {menu.name}
                      </Link>
                    )
                  );
                }
              })}

              {/* 移动端主题切换按钮 */}
              <ThemeToggle isMobile={true} />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleNavigation;
