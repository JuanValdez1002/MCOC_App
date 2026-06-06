function resolveImageSrc(imagePath) {
  return (typeof imagePath === 'string' && imagePath.startsWith('http'))
    ? imagePath
    : `../${imagePath}`;
}

const classFilters = [
  { value: 'science', label: 'Science', icon: '../images/Class_Images/Science.webp' },
  { value: 'skill', label: 'Skill', icon: '../images/Class_Images/Skill.webp' },
  { value: 'cosmic', label: 'Cosmic', icon: '../images/Class_Images/Cosmic.webp' },
  { value: 'mutant', label: 'Mutant', icon: '../images/Class_Images/Mutant.webp' },
  { value: 'mystic', label: 'Mystic', icon: '../images/Class_Images/Mystic.webp' },
  { value: 'tech', label: 'Tech', icon: '../images/Class_Images/Tech.webp' },
];

let champions = [];
let activeClassFilter = '';
let searchQuery = '';

function normalizeText(value) {
  return String(value ?? '').toLowerCase().trim();
}

function renderClassFilters() {
  const filterContainer = document.getElementById('champion-class-filter');
  if (!filterContainer) return;

  filterContainer.innerHTML = classFilters.map(filter => `
    <button type="button" class="champion-class-button${filter.value === activeClassFilter ? ' is-active' : ''}"
      data-class-filter="${filter.value}" aria-pressed="${filter.value === activeClassFilter}" title="${filter.label}">
      <img class="champion-class-button-icon" src="${filter.icon}" alt="${filter.label}" aria-hidden="true" />
      <span class="champion-class-button-label">${filter.label}</span>
    </button>
  `).join('');

  filterContainer.querySelectorAll('[data-class-filter]').forEach(button => {
    button.addEventListener('click', () => {
      activeClassFilter = button.getAttribute('data-class-filter') || 'all';
      renderClassFilters();
      renderChampions();
    });
  });
}

function renderChampions() {
  const grid = document.getElementById('champion-grid');
  const countEl = document.getElementById('champion-count');
  if (!grid || !countEl) return;

  const filtered = champions.filter(champ => {
    const matchesSearch = !searchQuery || normalizeText(champ.name).includes(searchQuery) || normalizeText(champ.class).includes(searchQuery);
    const matchesClass = !activeClassFilter || normalizeText(champ.class) === activeClassFilter;
    return matchesSearch && matchesClass;
  });

  countEl.textContent = `Showing ${filtered.length} of ${champions.length} champions`;
  grid.innerHTML = '';

  if (!filtered.length) {
    grid.innerHTML = '<p class="champion-empty-state">No champions match your search or class filter.</p>';
    return;
  }

  filtered.forEach((champ, idx) => {
    const card = document.createElement('div');
    card.className = `champion-card class-${normalizeText(champ.class)}`;
    card.onclick = () => window.location.href = `champion.html?id=${champ.index ?? idx}`;

    const imgSrc = resolveImageSrc(champ.image);

    card.innerHTML = `
      <img src="${imgSrc}" alt="${champ.name}" class="champion-avatar">
      <div class="champion-name">${champ.name.toUpperCase()}</div>
    `;

    grid.appendChild(card);
  });
}

function initChampionsPage() {
  const searchInput = document.getElementById('champion-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = normalizeText(e.target.value);
      renderChampions();
    });
  }

  renderClassFilters();

  fetch('../data/champions.json')
    .then(res => res.json())
    .then(data => {
      champions = data
        .map((c, i) => ({ ...c, index: i }))
        .sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)));
      renderChampions();
    })
    .catch(() => {
      const grid = document.getElementById('champion-grid');
      if (grid) grid.innerHTML = '<p class="champion-empty-state">Unable to load champions right now.</p>';
      const countEl = document.getElementById('champion-count');
      if (countEl) countEl.textContent = 'Showing 0 of 0 champions';
    });
}

document.addEventListener('DOMContentLoaded', initChampionsPage);
