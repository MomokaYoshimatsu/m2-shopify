function initM2ProductFaq(root = document) {
  root.querySelectorAll('.m2-pdp-faq__list').forEach((list) => {
    if (list.dataset.m2FaqInitialized === 'true') return;

    list.dataset.m2FaqInitialized = 'true';
    const items = Array.from(list.querySelectorAll('.m2-pdp-faq-item'));

    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;

        items.forEach((otherItem) => {
          if (otherItem !== item) otherItem.open = false;
        });
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => initM2ProductFaq());
document.addEventListener('shopify:section:load', (event) => initM2ProductFaq(event.target));
