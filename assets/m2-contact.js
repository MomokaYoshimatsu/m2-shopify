(() => {
  const SELECTORS = {
    topic: '[name="contact[お問い合わせ項目]"]:checked',
    familyName: '[name="contact[姓]"]',
    givenName: '[name="contact[名]"]',
    email: '[name="contact[email]"]',
    phone: '[name="contact[電話番号]"]',
    orderNumber: '[name="contact[注文No]"]',
    body: '[name="contact[body]"]',
  };

  const setErrorState = (control) => {
    const container = control.closest('.m2-contact-field, .m2-contact-choice-group, .m2-contact-consent');
    if (!container) return;

    const describedBy = control.getAttribute('aria-describedby');
    const error = describedBy ? document.getElementById(describedBy.split(' ')[0]) : null;
    const message = control.validity.valueMissing
      ? control.dataset.requiredMessage
      : control.dataset.invalidMessage || control.dataset.requiredMessage;

    control.setAttribute('aria-invalid', 'true');
    container.classList.add('is-invalid');
    if (error) {
      if (message) error.textContent = message;
      error.hidden = false;
    }
  };

  const clearErrorState = (control) => {
    const container = control.closest('.m2-contact-field, .m2-contact-choice-group, .m2-contact-consent');
    if (!container) return;

    const describedBy = control.getAttribute('aria-describedby');
    const error = describedBy ? document.getElementById(describedBy.split(' ')[0]) : null;
    control.removeAttribute('aria-invalid');
    container.classList.remove('is-invalid');
    if (error) error.hidden = true;
  };

  const initializeContact = (root) => {
    const form = root.closest('form');
    if (!form) return;

    const inputView = root.querySelector('[data-m2-view="input"]');
    const confirmView = root.querySelector('[data-m2-view="confirm"]');
    const successView = root.querySelector('[data-m2-view="success"]');
    const reviewButton = root.querySelector('[data-m2-review-button]');
    const backButton = root.querySelector('[data-m2-back-button]');
    const finalSubmitButton = root.querySelector('[data-m2-final-submit]');
    const serverError = root.querySelector('[data-m2-server-error]');
    let currentState = root.dataset.m2State || 'input';
    let isSubmitting = false;

    const getValue = (selector) => form.querySelector(selector)?.value.trim() || '';

    const setOutput = (key, value) => {
      const output = confirmView?.querySelector(`[data-m2-confirm-output="${key}"]`);
      if (output) output.textContent = value || '—';
    };

    const populateConfirmation = () => {
      const fullName = [getValue(SELECTORS.familyName), getValue(SELECTORS.givenName)].filter(Boolean).join('　');
      setOutput('topic', getValue(SELECTORS.topic));
      setOutput('name', fullName);
      setOutput('email', getValue(SELECTORS.email));
      setOutput('phone', getValue(SELECTORS.phone));
      setOutput('order-number', getValue(SELECTORS.orderNumber));
      setOutput('body', getValue(SELECTORS.body));
    };

    const showState = (state, moveFocus = true) => {
      currentState = state;
      root.dataset.m2State = state;
      if (inputView) inputView.hidden = state !== 'input';
      if (confirmView) confirmView.hidden = state !== 'confirm';
      if (successView) successView.hidden = state !== 'success';

      if (!moveFocus) return;
      const activeView = root.querySelector(`[data-m2-view="${state}"]`);
      const heading = activeView?.querySelector('[data-m2-state-heading]');
      heading?.focus();
    };

    form.addEventListener(
      'invalid',
      (event) => {
        setErrorState(event.target);
      },
      true
    );

    form.addEventListener('input', (event) => {
      const control = event.target;
      if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) return;
      if (control.validity.valid) clearErrorState(control);
    });

    form.addEventListener('change', (event) => {
      const control = event.target;
      if (!(control instanceof HTMLInputElement)) return;

      if (control.type === 'radio') {
        form.querySelectorAll(`[name="${control.name}"]`).forEach((radio) => clearErrorState(radio));
      } else if (control.validity.valid) {
        clearErrorState(control);
      }
    });

    reviewButton?.addEventListener('click', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        form.querySelector(':invalid')?.focus();
        return;
      }

      populateConfirmation();
      showState('confirm');
    });

    backButton?.addEventListener('click', () => {
      showState('input');
    });

    form.addEventListener('submit', (event) => {
      if (currentState === 'input') {
        if (!form.checkValidity()) {
          event.preventDefault();
          form.reportValidity();
          form.querySelector(':invalid')?.focus();
          return;
        }

        event.preventDefault();
        populateConfirmation();
        showState('confirm');
        return;
      }

      if (currentState === 'confirm') {
        if (isSubmitting) {
          event.preventDefault();
          return;
        }

        isSubmitting = true;
        form.setAttribute('aria-busy', 'true');
        if (finalSubmitButton) {
          finalSubmitButton.disabled = true;
          const submitLabel = finalSubmitButton.querySelector('[data-m2-submit-label]');
          if (submitLabel) submitLabel.textContent = '送信中…';
        }
      }
    }, true);

    if (serverError) {
      serverError.focus();
    } else if (currentState === 'success') {
      showState('success');
    } else {
      showState('input', false);
    }
  };

  document.querySelectorAll('[data-m2-contact]').forEach(initializeContact);
})();
