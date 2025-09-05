fetch('../data/champions.json')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('champion-list');
    data.forEach((champ, idx) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `champion.html?id=${idx}`;
      a.innerHTML = `<img src="../${champ.image}" alt="${champ.name}" style="width:40px;height:40px;vertical-align:middle;margin-right:8px;">${champ.name}`;
      li.appendChild(a);
      list.appendChild(li);
    });
  });
