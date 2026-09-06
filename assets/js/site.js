function initProjectFilters() {
  const section = document.querySelector('[data-project-list]');
  if (!section) return;

  const cards = [...section.querySelectorAll('[data-project-tags]')];
  const controls = [...section.querySelectorAll('[data-category]')];
  const all = controls.find((button) => button.dataset.category === 'all');
  const status = section.querySelector('[data-filter-status]');
  const empty = section.querySelector('[data-project-empty]');
  const tagsFor = (card) => card.dataset.projectTags.trim().split(/\s+/);
  const matches = (card, tags) => tags.length === 0 || tags.some((tag) => tagsFor(card).includes(tag));
  const categoryTags = (button) => button.dataset.match.trim().split(/\s+/).filter(Boolean);

  for (const button of controls) {
    const count = cards.filter((card) => matches(card, categoryTags(button))).length;
    button.querySelector('[data-count]').textContent = count;
  }

  function render({ scroll = false } = {}) {
    const params = new URLSearchParams(location.hash.slice(1));
    const tag = params.get('tag');
    const category = controls.find((button) => button.dataset.category === params.get('category')) || all;
    const tags = tag ? [tag] : categoryTags(category);
    let count = 0;

    for (const card of cards) {
      card.hidden = !matches(card, tags);
      if (!card.hidden) count += 1;
    }
    for (const button of controls) {
      button.setAttribute('aria-pressed', String(!tag && button === category));
    }

    const label = tag ? '#' + tag : category.querySelector('[data-label]').textContent;
    status.textContent = label + ' · ' + count + '개 프로젝트';
    empty.hidden = count > 0;
    if (scroll && (tag || params.has('category'))) section.scrollIntoView();
  }

  for (const button of controls) {
    button.addEventListener('click', () => {
      const reset = button === all || button.getAttribute('aria-pressed') === 'true';
      const hash = reset ? '#projects' : '#category=' + encodeURIComponent(button.dataset.category);
      history.replaceState(null, '', location.pathname + location.search + hash);
      render();
    });
  }

  section.querySelector('.category-filters').hidden = false;
  window.addEventListener('hashchange', () => render({ scroll: true }));
  window.addEventListener('popstate', () => render({ scroll: true }));
  render({ scroll: true });
}

function initSectionNavigation() {
  const links = [...document.querySelectorAll('.section-nav a')];
  const sections = [...document.querySelectorAll('.home-section')];
  if (!links.length || !sections.length) return;

  let scheduled = false;
  function update() {
    const current = sections.filter((section) => section.getBoundingClientRect().top <= 160).pop() || sections[0];
    for (const link of links) {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  update();
}

initProjectFilters();
initSectionNavigation();
