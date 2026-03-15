fetch('../data/champions.json')
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById('champion-grid');
    const countEl = document.getElementById('champion-count');
    
    countEl.textContent = `Showing ${data.length} of ${data.length} champions`;
    
    data.forEach((champ, idx) => {
      const card = document.createElement('div');
      card.className = `champion-card class-${champ.class.toLowerCase()}`;
      card.onclick = () => window.location.href = `champion.html?id=${idx}`;
      
      card.innerHTML = `
        <img src="../${champ.image}" alt="${champ.name}" class="champion-avatar">
        <div class="champion-name">${champ.name.toUpperCase()}</div>
      `;
      
      grid.appendChild(card);
    });
  });
