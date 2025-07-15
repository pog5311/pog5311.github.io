fetch('data/punishes.json')
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById('punish-grid');
    const template = document.getElementById('punish-card-template');

    data.forEach(entry => {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.move-name').textContent = entry.move;
      clone.querySelector('.startup').textContent = 'Startup: ' + entry.startup;
      clone.querySelector('.gif-preview').src = entry.gif;
      clone.querySelector('.character').textContent = 'Character: ' + entry.character;

      const tagsContainer = clone.querySelector('.tags');
      entry.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });

      const notesList = clone.querySelector('.notes');
      entry.notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note;
        notesList.appendChild(li);
      });

      const button = clone.querySelector('.expand-button');
      const details = clone.querySelector('.card-details');
      button.addEventListener('click', () => {
        details.classList.toggle('hidden');
      });

      grid.appendChild(clone);
    });
  });