class CartNotification extends HTMLElement {
  constructor() {
    super();

    this.notification = document.getElementById('cart-notification');
    this.header = document.querySelector('sticky-header');
    this.onBodyClick = this.handleBodyClick.bind(this);
    this.onTransitionEnd = this.handleTransitionEnd.bind(this);
    this.isOpen = false;
    this.focusTrapPending = false;
    this.openFocusFallback = null;
    this.closeFallback = null;

    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.notification.addEventListener('transitionend', this.onTransitionEnd);
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
  }

  open() {
    window.clearTimeout(this.closeFallback);
    this.notification.hidden = false;
    this.notification.setAttribute('aria-hidden', 'false');
    this.notification.removeAttribute('inert');

    if (!this.isOpen) {
      this.isOpen = true;
      this.focusTrapPending = true;
      this.notification.classList.add('animate');
      void this.notification.offsetWidth;
      this.notification.classList.add('active');

      window.clearTimeout(this.openFocusFallback);
      this.openFocusFallback = window.setTimeout(() => this.activateFocusTrap(), 500);
    }

    document.body.removeEventListener('click', this.onBodyClick);
    document.body.addEventListener('click', this.onBodyClick);

    this.dispatchCartViewEvent();
  }

  // The notification's outer element is server-rendered once at page load, so
  // its `cart` Liquid object reflects the pre-add state. The morphed children
  // (inserted from the /cart/add.js sections response in renderContents) are
  // post-add, but they don't expose the full cart shape we need for the event
  // payload. So we keep an explicit /cart.json fetch on open. Migrating to the
  // factory + filter would require re-rendering the notification element
  // itself in sections, which is out of scope for this PR.
  async dispatchCartViewEvent() {
    const { CartViewEvent } = window.StandardEvents || {};
    if (!CartViewEvent) return;

    try {
      const response = await fetch(`${routes.cart_url}.json`);
      const cart = await response.json();
      if (!cart?.currency) return;

      this.dispatchEvent(
        new CartViewEvent({
          context: 'dialog',
          cart: CartViewEvent.createCartFromAjaxResponse(cart),
        })
      );
    } catch (e) {
      // cart:view is informational; swallow fetch errors
    }
  }

  close() {
    const wasOpen = this.isOpen;

    this.isOpen = false;
    this.focusTrapPending = false;
    window.clearTimeout(this.openFocusFallback);
    this.notification.classList.remove('active');
    this.notification.setAttribute('aria-hidden', 'true');
    this.notification.setAttribute('inert', '');
    document.body.removeEventListener('click', this.onBodyClick);

    if (wasOpen) removeTrapFocus(this.activeElement);

    window.clearTimeout(this.closeFallback);
    if (!wasOpen) {
      this.finishClose();
      return;
    }

    this.closeFallback = window.setTimeout(() => this.finishClose(), 500);
  }

  renderContents(parsedState) {
    if (!this.isSuccessfulCartAdd(parsedState)) return;

    this.cartItemKey = parsedState.key;
    this.getSectionsToRender().forEach((section) => {
      document.getElementById(section.id).innerHTML = this.getSectionInnerHTML(
        parsedState.sections[section.id],
        section.selector
      );
    });

    if (this.header) this.header.reveal();
    this.open();
  }

  isSuccessfulCartAdd(parsedState) {
    if (!parsedState || parsedState.status || !parsedState.key || !parsedState.sections) return false;

    return ['cart-notification-product', 'cart-icon-bubble'].every(
      (sectionId) => typeof parsedState.sections[sectionId] === 'string'
    );
  }

  handleTransitionEnd(event) {
    if (event.target !== this.notification) return;
    if (!['transform', 'visibility'].includes(event.propertyName)) return;

    if (this.isOpen) {
      if (event.propertyName === 'transform') this.activateFocusTrap();
      return;
    }

    this.finishClose();
  }

  activateFocusTrap() {
    if (!this.isOpen || !this.focusTrapPending || !this.notification.classList.contains('active')) return;

    window.clearTimeout(this.openFocusFallback);
    this.focusTrapPending = false;
    this.notification.focus();
    trapFocus(this.notification);
  }

  finishClose() {
    if (this.isOpen) return;

    window.clearTimeout(this.closeFallback);
    this.notification.hidden = true;
    this.notification.classList.remove('animate');
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-notification')) {
      const disclosure = target.closest('details-disclosure, header-menu');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
      this.close();
    }
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-notification', CartNotification);
