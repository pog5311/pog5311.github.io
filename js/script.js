// Utility: Load JSON
async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return res.json();
}

const tagify = (tags=[]) =>
    `<div class="tags">${tags.map(tag =>
        `<span class="tag ${tag.replace(/[^a-zA-Z0-9]/g, '')}">${tag}</span>`).join('')}</div>`;

let punishesData = [];
// Preload punishes.json once
loadJSON('data/punishes.json').then(data => { punishesData = data; });

document.getElementById('character-select').addEventListener('change', async function () {
    const character = this.value;
    const container = document.getElementById('move-cards');
    container.innerHTML = '';

    if (!character) return;

    // Load move data for the character
    let moves = [];
    try {
        moves = await loadJSON(`data/${character}.json`);
    } catch (e) {
        container.innerHTML = '<div style="color:red">No move data found for this character.</div>';
        return;
    }

    moves.forEach((move, idx) => {
        // If your moves don't have tags, add tags logic here or in your data!
        const tags = move.tags || [];
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <h3>${move.name}</h3>
            <img src="${move.gif}" alt="${move.name} punish">
            ${tagify(tags)}
            <p><strong>Startup:</strong> ${move.startup || ''}</p>
            <p>${move.description || ''}</p>
        `;

        card.addEventListener('click', () => openModal(character, move));

        container.appendChild(card);
    });
});

// Modal logic
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');

function openModal(character, move) {
    // Find Yoshimitsu punish for this move if available
    let punish = null;
    if (punishesData.length) {
        punish = punishesData.find(p =>
            p.character.toLowerCase() === character.toLowerCase() &&
            (p.move.toLowerCase() === move.name.toLowerCase() ||
             (move.altNames && move.altNames.includes(p.move)))
        );
    }
    const moveTags = move.tags || [];
    const moveNotes = move.notes ? move.notes.map((n, i) => `<li>${n}</li>`).join('') : '';
    modalContent.innerHTML = `
        <span class="close-modal" onclick="closeModal()">&times;</span>
        <h2>${move.name}</h2>
        <img src="${move.gif}" alt="${move.name}">
        ${tagify(moveTags)}
        <p><strong>Startup:</strong> ${move.startup || ''}</p>
        <p>${move.description || ''}</p>
        ${moveNotes ? `<ul>${moveNotes}</ul>` : ''}
        ${punish ? `
            <hr>
            <h3>Yoshimitsu Punish</h3>
            <strong>${punish.move}</strong> <br>
            <img src="${punish.gif}" alt="Punish" style="max-width:180px;margin:8px 0;"><br>
            ${tagify(punish.tags)}
            <ul>${punish.notes ? punish.notes.map(n => `<li>${n}</li>`).join('') : ''}</ul>
        ` : `<p><em>No specific punish listed.</em></p>`}
    `;
    modalOverlay.style.display = 'flex';
}

function closeModal() {
    modalOverlay.style.display = 'none';
}

// Allow overlay click to close modal
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) closeModal();
});
// Allow Esc to close modal
window.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
});
window.closeModal = closeModal; // so onclick in modal HTML works
