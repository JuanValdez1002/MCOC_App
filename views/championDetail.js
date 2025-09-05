function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

fetch('../data/champions.json')
  .then(res => res.json())
  .then(data => {
    const idx = parseInt(getQueryParam('id'), 10);
    const champ = data[idx];
    if (!champ) {
      document.getElementById('champion-details').innerHTML = '<p>Champion not found.</p>';
      return;
    }
    document.getElementById('champion-details').innerHTML = `
      <h2>${champ.name}</h2>
      <img src="../${champ.image}" alt="${champ.name}" style="max-width:150px;">
      <p>${champ.bio}</p>
    `;
    const prestige = champ.stats[0].prestige;
    const input = document.getElementById('prestige-level');
    const output = document.getElementById('stats-output');
    function updateStats() {
      const lvl = input.value;
      output.textContent = `Prestige at level ${lvl}: ${prestige[lvl] || 'N/A'}`;
    }
    input.addEventListener('input', updateStats);
    updateStats();
  });
