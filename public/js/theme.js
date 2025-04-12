// 主题切换脚本
document.addEventListener('DOMContentLoaded', function() {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const lightIcon = document.querySelector('.theme-light');
  const darkIcon = document.querySelector('.theme-dark');
  const mobileLightIcon = document.querySelector('.mobile-theme-light');
  const mobileDarkIcon = document.querySelector('.mobile-theme-dark');
  
  // 检查系统偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 检查本地存储
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    html.classList.remove('light');
    html.classList.add('dark');
    if (lightIcon && darkIcon) {
      lightIcon.classList.add('hidden');
      darkIcon.classList.remove('hidden');
    }
    if (mobileLightIcon && mobileDarkIcon) {
      mobileLightIcon.classList.add('hidden');
      mobileDarkIcon.classList.remove('hidden');
    }
  }
  
  function toggleTheme() {
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.classList.add('light');
      if (lightIcon && darkIcon) {
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
      }
      if (mobileLightIcon && mobileDarkIcon) {
        mobileLightIcon.classList.remove('hidden');
        mobileDarkIcon.classList.add('hidden');
      }
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      if (lightIcon && darkIcon) {
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
      }
      if (mobileLightIcon && mobileDarkIcon) {
        mobileLightIcon.classList.add('hidden');
        mobileDarkIcon.classList.remove('hidden');
      }
      localStorage.setItem('theme', 'dark');
    }
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }
});
