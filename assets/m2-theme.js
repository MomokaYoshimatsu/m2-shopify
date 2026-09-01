class M2HeroSlider extends HTMLElement {
  connectedCallback() {
    this.slides = Array.from(this.querySelectorAll('[data-m2-hero-slide]'));
    this.indicators = Array.from(this.querySelectorAll('[data-m2-hero-indicator]'));
    this.currentIndex = Math.max(0, this.slides.findIndex((slide) => slide.classList.contains('is-active')));
    this.intervalDuration = Math.max(3000, Number(this.dataset.interval) || 5000);
    this.autoplay = this.dataset.autoplay === 'true' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.showSlide(index);
        this.restartAutoplay();
      });
    });

    this.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        this.showSlide(this.currentIndex - 1);
        this.restartAutoplay();
      }

      if (event.key === 'ArrowRight') {
        this.showSlide(this.currentIndex + 1);
        this.restartAutoplay();
      }
    });

    this.handleVisibilityChange = () => {
      if (document.hidden) {
        this.stopAutoplay();
      } else {
        this.startAutoplay();
      }
    };
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    if (Shopify.designMode) {
      this.addEventListener('shopify:block:select', (event) => {
        const selectedSlide = event.target.closest('[data-m2-hero-slide]');
        const selectedIndex = this.slides.indexOf(selectedSlide);

        if (selectedIndex >= 0) {
          this.showSlide(selectedIndex);
          this.stopAutoplay();
        }
      });
    }

    this.startAutoplay();
  }

  disconnectedCallback() {
    this.stopAutoplay();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  showSlide(index) {
    if (this.slides.length < 2) return;

    this.currentIndex = (index + this.slides.length) % this.slides.length;
    this.slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === this.currentIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.toggleAttribute('inert', !isActive);
    });
    this.indicators.forEach((indicator, indicatorIndex) => {
      indicator.setAttribute('aria-current', String(indicatorIndex === this.currentIndex));
    });
  }

  startAutoplay() {
    if (!this.autoplay || this.slides.length < 2 || this.autoplayTimer) return;

    this.autoplayTimer = window.setInterval(() => {
      this.showSlide(this.currentIndex + 1);
    }, this.intervalDuration);
  }

  stopAutoplay() {
    window.clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

if (!customElements.get('m2-hero-slider')) {
  customElements.define('m2-hero-slider', M2HeroSlider);
}

function initM2HeaderDrawer() {
  const drawer = document.querySelector('.template-index header-drawer');
  const details = drawer?.querySelector('#Details-menu-drawer-container');
  const summary = details?.querySelector(':scope > summary');
  const menu = details?.querySelector(':scope > #menu-drawer');

  if (!drawer || !details || !summary || !menu) return;

  let focusTimer;
  const firstMenuItem = () => menu.querySelector('.menu-drawer__menu-item');

  const updateMenuState = () => {
    const isOpen = details.open;
    summary.setAttribute('aria-expanded', String(isOpen));
    summary.setAttribute('aria-label', isOpen ? summary.dataset.closeLabel : summary.dataset.openLabel);

    window.clearTimeout(focusTimer);
    if (!isOpen) return;

    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260;
    focusTimer = window.setTimeout(() => {
      if (details.open && details.classList.contains('menu-opening')) firstMenuItem()?.focus();
    }, delay);
  };

  details.addEventListener('toggle', updateMenuState);
  menu.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (details.open) drawer.closeMenuDrawer(event, summary);
    });
  });
  drawer.closest('.header')?.querySelectorAll('.header__icons a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (details.open) drawer.closeMenuDrawer(event, summary);
    });
  });
}

initM2HeaderDrawer();
