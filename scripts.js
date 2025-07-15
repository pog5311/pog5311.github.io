document.addEventListener("DOMContentLoaded", () => {
  const characterSelect = document.getElementById("character-select");
  const punishContainer = document.getElementById("punish-container");

  function loadPunishes(character) {
    fetch("data/punishes.json")
      .then(response => response.json())
      .then(data => {
        const punishes = data[character] || [];
        punishContainer.innerHTML = "";

        punishes.forEach(p => {
          const div = document.createElement("div");
          div.className = "punish";
          div.innerHTML = `
            <img src="gifs/${character}/${p.filename}" alt="Punish GIF">
            <div class="punish-description">${p.description}</div>
          `;
          punishContainer.appendChild(div);
        });
      });
  }

  characterSelect.addEventListener("change", (e) => {
    loadPunishes(e.target.value);
  });

  loadPunishes(characterSelect.value);
});