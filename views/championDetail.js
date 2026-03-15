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
    
    // Build the champion detail page
    let html = `
      <div class="champion-header">
        <img src="../${champ.image}" alt="${champ.name}" class="champion-main-image">
        <div class="champion-title-section">
          <h1>${champ.name}</h1>
          <p class="champion-class class-${champ.class.toLowerCase()}">${champ.class}</p>
          <p class="champion-release">Released: ${champ.release}</p>
        </div>
      </div>
      
      <div class="champion-section">
        <h2>About ${champ.name}</h2>
        <p>${champ.bio}</p>
      </div>
    `;
    
    // Base Stats Section
    if (champ.baseStats) {
      html += `
        <div class="champion-section">
          <h2>Base Stats and Abilities</h2>
          <table class="stats-table">
            <thead>
              <tr>
                <th>Rarity</th>
                <th>Health</th>
                <th>Attack</th>
                <th>PI</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      for (let star in champ.baseStats) {
        const stats = champ.baseStats[star];
        html += `
          <tr>
            <td>${star.replace('star', '-Star').toUpperCase()}</td>
            <td>${stats.health.toLocaleString()}</td>
            <td>${stats.attack.toLocaleString()}</td>
            <td>${stats.pi.toLocaleString()}</td>
          </tr>
        `;
      }
      
      html += `
            </tbody>
          </table>
        </div>
      `;
    }
    
    // Champion Attributes
    if (champ.attributes) {
      html += `
        <div class="champion-section">
          <h2>Champion Attributes</h2>
          <div class="attributes-grid">
            <div class="attribute-item">
              <span class="attribute-label">Survivability</span>
              <span class="attribute-value">${champ.attributes.survivability}/5</span>
            </div>
            <div class="attribute-item">
              <span class="attribute-label">Damage</span>
              <span class="attribute-value">${champ.attributes.damage}/5</span>
            </div>
            <div class="attribute-item">
              <span class="attribute-label">Ease of Use</span>
              <span class="attribute-value">${champ.attributes.easeOfUse}/5</span>
            </div>
            <div class="attribute-item">
              <span class="attribute-label">Utility</span>
              <span class="attribute-value">${champ.attributes.utility}/5</span>
            </div>
            <div class="attribute-item">
              <span class="attribute-label">Defender Strength</span>
              <span class="attribute-value">${champ.attributes.defenderStrength}/5</span>
            </div>
          </div>
        </div>
      `;
    }
    
    // Mechanics
    if (champ.mechanics) {
      html += `
        <div class="champion-section">
          <h2>${champ.name}'s Mechanics</h2>
          <p>${champ.mechanics}</p>
        </div>
      `;
    }
    
    // Strengths and Weaknesses
    if (champ.strengths || champ.weaknesses) {
      html += `<div class="champion-section"><h2>Strengths and Weaknesses</h2>`;
      
      if (champ.strengths) {
        html += `<h3>Strengths</h3><ul class="strength-weakness-list">`;
        champ.strengths.forEach(s => {
          html += `<li><strong>${s.title}:</strong> ${s.description}</li>`;
        });
        html += `</ul>`;
      }
      
      if (champ.weaknesses) {
        html += `<h3>Weaknesses</h3><ul class="strength-weakness-list">`;
        champ.weaknesses.forEach(w => {
          html += `<li><strong>${w.title}:</strong> ${w.description}</li>`;
        });
        html += `</ul>`;
      }
      
      html += `</div>`;
    }
    
    // Abilities
    if (champ.abilities) {
      html += `
        <div class="champion-section">
          <h2>Abilities</h2>
          
          ${champ.abilities.alwaysActive ? `
            <div class="ability-block">
              <h3>Always Active</h3>
              <p>${champ.abilities.alwaysActive}</p>
            </div>
          ` : ''}
          
          ${champ.abilities.special1 ? `
            <div class="ability-block">
              <h3>Special 1 – ${champ.abilities.special1.name}</h3>
              <p>${champ.abilities.special1.description}</p>
            </div>
          ` : ''}
          
          ${champ.abilities.special2 ? `
            <div class="ability-block">
              <h3>Special 2 – ${champ.abilities.special2.name}</h3>
              <p>${champ.abilities.special2.description}</p>
            </div>
          ` : ''}
          
          ${champ.abilities.special3 ? `
            <div class="ability-block">
              <h3>Special 3 – ${champ.abilities.special3.name}</h3>
              <p>${champ.abilities.special3.description}</p>
            </div>
          ` : ''}
          
          ${champ.abilities.signature ? `
            <div class="ability-block">
              <h3>Signature Ability – ${champ.abilities.signature.name}</h3>
              <p>${champ.abilities.signature.description}</p>
            </div>
          ` : ''}
        </div>
      `;
    }
    
    // Synergies
    if (champ.synergies && champ.synergies.length > 0) {
      html += `
        <div class="champion-section">
          <h2>Synergy Bonuses</h2>
      `;
      
      champ.synergies.forEach(syn => {
        html += `
          <div class="synergy-block">
            <h3>${syn.name}</h3>
            <p><strong>With:</strong> ${syn.partners.join(', ')}</p>
            <p>${syn.effect}</p>
          </div>
        `;
      });
      
      html += `</div>`;
    }
    
    // Recommended Masteries
    if (champ.masteries && champ.masteries.length > 0) {
      html += `
        <div class="champion-section">
          <h2>Recommended Masteries</h2>
      `;
      
      champ.masteries.forEach(mastery => {
        html += `
          <div class="mastery-block">
            <h3>${mastery.name}</h3>
            <p>${mastery.description}</p>
          </div>
        `;
      });
      
      html += `</div>`;
    }
    
    document.getElementById('champion-details').innerHTML = html;
  });