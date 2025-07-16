
document.getElementById('character-select').addEventListener('change', async function () {
    const character = this.value;
    const container = document.getElementById('move-cards');
    container.innerHTML = '';

    if (!character) return;

    const res = await fetch(`data/${character}.json`);
    const moves = await res.json();

    moves.forEach(move => {
        const card = document.createElement('div');
        card.className = 'card';

        const title = document.createElement('h3');
        title.textContent = move.name;

        const gif = document.createElement('img');
        gif.src = move.gif;
        gif.alt = `${move.name} punish`;

        const detail = document.createElement('div');
        detail.className = 'details';
        detail.innerHTML = `<p><strong>Startup:</strong> ${move.startup}</p><p>${move.description}</p>`;

        card.appendChild(title);
        card.appendChild(gif);
        card.appendChild(detail);

        card.addEventListener('click', () => {
            detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
        });

        container.appendChild(card);
    });
});
