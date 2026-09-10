class M2HeroSlider extends HTMLElement {
  connectedCallback() {
    this.slides = Array.from(this.querySelectorAll('[data-m2-hero-slide]'));
    this.indicators = Array.from(this.querySelectorAll('[data-m2-hero-indicator]'));
    this.currentIndex = Math.max(0, this.slides.findIndex((slide) => slide.classList.contains('is-active')));
    this.intervalDuration = Math.max(3000, Number(this.dataset.interval) || 5000);
    this.autoplay = this.dataset.autoplay === 'true' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.slidesContainer = this.querySelector('.m2-top-hero__slides');
    this.activePointer = null;
    this.suppressClickTimer = null;

    this.handlePointerMove = this.onPointerMove.bind(this);
    this.handlePointerEnd = this.onPointerEnd.bind(this);
    this.handlePointerCancel = this.onPointerCancel.bind(this);

    this.slidesContainer?.addEventListener('pointerdown', (event) => this.onPointerDown(event));
    this.slidesContainer?.addEventListener('click', (event) => this.onSlideLinkClick(event), true);
    this.slidesContainer?.addEventListener('dragstart', (event) => event.preventDefault());

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
    this.removePointerListeners();
    window.clearTimeout(this.suppressClickTimer);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  onPointerDown(event) {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;

    this.activePointer = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      link: event.target.closest('[data-m2-hero-link]'),
    };
    this.suppressNextClick = false;
    window.clearTimeout(this.suppressClickTimer);
    this.stopAutoplay();
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerEnd);
    window.addEventListener('pointercancel', this.handlePointerCancel);
  }

  onPointerMove(event) {
    if (!this.activePointer || event.pointerId !== this.activePointer.id) return;

    this.activePointer.currentX = event.clientX;
    this.activePointer.currentY = event.clientY;
  }

  onPointerEnd(event) {
    if (!this.activePointer || event.pointerId !== this.activePointer.id) return;

    this.activePointer.currentX = event.clientX;
    this.activePointer.currentY = event.clientY;
    const deltaX = this.activePointer.currentX - this.activePointer.startX;
    const deltaY = this.activePointer.currentY - this.activePointer.startY;
    const moved = Math.hypot(deltaX, deltaY) > 10;
    const swipeThreshold = Math.max(40, Math.min(80, this.clientWidth * 0.08));

    if (Math.abs(deltaX) >= swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      this.showSlide(this.currentIndex + (deltaX < 0 ? 1 : -1));
    }

    this.suppressNextClick = moved && Boolean(this.activePointer.link);
    this.activePointer = null;
    this.removePointerListeners();
    this.restartAutoplay();

    this.suppressClickTimer = window.setTimeout(() => {
      this.suppressNextClick = false;
    });
  }

  onPointerCancel(event) {
    if (!this.activePointer || event.pointerId !== this.activePointer.id) return;

    this.activePointer = null;
    this.suppressNextClick = false;
    this.removePointerListeners();
    this.restartAutoplay();
  }

  onSlideLinkClick(event) {
    if (!this.suppressNextClick || !event.target.closest('[data-m2-hero-link]')) return;

    event.preventDefault();
    event.stopPropagation();
    this.suppressNextClick = false;
  }

  removePointerListeners() {
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerEnd);
    window.removeEventListener('pointercancel', this.handlePointerCancel);
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
  const drawer = document.querySelector('.m2-site-shell header-drawer');
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
