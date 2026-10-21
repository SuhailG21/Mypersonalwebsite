(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const year = document.querySelector('#year');
  const themeButton = document.querySelector('#theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const themeLabel = themeButton?.querySelector('.theme-toggle-label');
  if (year) year.textContent = new Date().getFullYear();

  const applyTheme = (theme, persist = false) => {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    themeButton?.setAttribute('aria-pressed', String(isDark));
    themeButton?.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    if (themeButton) {
      themeButton.title = `Switch to ${isDark ? 'light' : 'dark'} mode`;
    }
    if (themeLabel) themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
    if (themeColor) themeColor.content = isDark ? '#101c2e' : '#f3f6fc';
    if (persist) {
      try {
        localStorage.setItem('developer-portfolio-theme', isDark ? 'dark' : 'light');
      } catch {
        // Theme switching still works when browser storage is unavailable.
      }
    }
  };

  if (themeButton) {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    themeButton.addEventListener('click', () => {
      applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !expanded);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        nav.classList.remove('is-open');
        menuButton.focus();
      }
    });
  }

  document.querySelectorAll('[data-paged-list]').forEach((list) => {
    const entries = [...list.querySelectorAll('[data-paged-item]')];
    const controls = list.querySelector('[data-paged-controls]');
    const previous = controls?.querySelector('[data-paged-previous]');
    const next = controls?.querySelector('[data-paged-next]');
    const count = controls?.querySelector('[data-paged-count]');
    const itemsPerPage = 3;
    const pageCount = Math.ceil(entries.length / itemsPerPage);
    let currentPage = 0;

    if (!entries.length || !previous || !next || !count) return;

    const showPage = () => {
      entries.forEach((entry, index) => {
        entry.hidden = Math.floor(index / itemsPerPage) !== currentPage;
      });
      previous.disabled = currentPage === 0;
      next.disabled = currentPage === pageCount - 1;
      count.textContent = `${String(currentPage + 1).padStart(2, '0')} / ${String(pageCount).padStart(2, '0')}`;
      count.setAttribute('aria-label', `Page ${currentPage + 1} of ${pageCount}`);
    };

    previous.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage -= 1;
        showPage();
      }
    });
    next.addEventListener('click', () => {
      if (currentPage < pageCount - 1) {
        currentPage += 1;
        showPage();
      }
    });
    showPage();
  });

  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    items.forEach((item) => observer.observe(item));
  } else {
    items.forEach((item) => item.classList.add('is-visible'));
  }
})();
