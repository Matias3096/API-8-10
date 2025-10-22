document.addEventListener('DOMContentLoaded', function() {
  const addButton = document.getElementById('addCharacter');
  const addSixButton = document.getElementById('addSix');
  const clearButton = document.getElementById('clearGallery');
  const gallery = document.getElementById('gallery');
  const characterCount = document.getElementById('characterCount');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const loadingMessage = document.getElementById('loadingMessage');
  const messageContainer = document.getElementById('messageContainer');

  const MAX_CHARACTERS = 15;
  let characters = [];


  function showMessage(text, color = '#ffb86c') {
    messageContainer.textContent = text;
    messageContainer.style.backgroundColor = color;
    messageContainer.classList.remove('hidden');
    setTimeout(() => messageContainer.classList.add('hidden'), 4000);
  }

  // =============================
  // 🌐 OBTENER PERSONAJE ALEATORIO
  // =============================
  async function getRandomCharacter() {
    try {
      const randomId = Math.floor(Math.random() * 826) + 1;
      const response = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
      if (!response.ok) throw new Error('Error al obtener el personaje');
      const character = await response.json();
      return character;
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el personaje. Intenta de nuevo.');
      return null;
    }
  }

  // =============================
  // 💬 MENSAJE TEMPORAL
  // =============================
  function showMessage(text, color = '#ffb86c') {
    messageContainer.textContent = text;
    messageContainer.style.backgroundColor = color;
    messageContainer.classList.remove('hidden');
    setTimeout(() => messageContainer.classList.add('hidden'), 4000);
  }

  // =============================
  // ➕ AGREGAR 1 PERSONAJE
  // =============================
  async function addCharacter() {
    if (characters.length >= MAX_CHARACTERS) {
      showMessage('La galería está llena (15 personajes).', '#ff5555');
      return;
    }

    loadingMessage.classList.remove('hidden');
    const character = await getRandomCharacter();
    loadingMessage.classList.add('hidden');

    if (character) {
      if (characters.some(c => c.id === character.id)) {
        showMessage('Este personaje ya está en tu galería. ¡Intenta otro!', '#ffb86c');
        return;
      }

      characters.push(character);
      updateGallery();
      updateCounter();

      if (characters.length === 1) welcomeMessage.classList.add('hidden');
    }
  }

  // =============================
  // ➕➕ AGREGAR 6 PERSONAJES
  // =============================
  async function addSixCharacters() {
    const remaining = MAX_CHARACTERS - characters.length;

    if (remaining <= 0) {
      showMessage('La galería está llena (15 personajes).', '#ff5555');
      return;
    }

    loadingMessage.classList.remove('hidden');

    let added = 0;
    while (added < 6 && characters.length < MAX_CHARACTERS) {
      const character = await getRandomCharacter();
      if (character && !characters.some(c => c.id === character.id)) {
        characters.push(character);
        added++;
      }
    }

    loadingMessage.classList.add('hidden');

    if (added > 0) {
      updateGallery();
      updateCounter();
      welcomeMessage.classList.add('hidden');
    } else {
      showMessage('No se pudieron agregar personajes (posibles duplicados).', '#ffb86c');
    }
  }

  // =============================
  // 🧩 ACTUALIZAR GALERÍA
  // =============================
  function updateGallery() {
    gallery.innerHTML = '';

    characters.forEach(character => {
      const card = document.createElement('div');
      card.className = 'character-card';

      let statusClass = '';
      if (character.status === 'Alive') statusClass = 'alive';
      else if (character.status === 'Dead') statusClass = 'dead';
      else statusClass = 'unknown';

      card.innerHTML = `
        <img src="${character.image}" alt="${character.name}" class="character-image">
        <div class="character-info">
          <h3 class="character-name">${character.name}</h3>
          <p class="character-details">
            <span class="character-status ${statusClass}"></span>
            ${character.status} - ${character.species}
          </p>
          <p class="character-details">Origen: ${character.origin.name}</p>
          <p class="character-details">Ubicación: ${character.location.name}</p>
        </div>
      `;

      gallery.appendChild(card);
    });
  }

  // =============================
  // 🔢 ACTUALIZAR CONTADOR
  // =============================
  function updateCounter() {
    characterCount.textContent = characters.length;
  }

  // =============================
  // 🗑️ LIMPIAR GALERÍA
  // =============================
  function clearGallery() {
    characters = [];
    gallery.innerHTML = '';
    updateCounter();
    welcomeMessage.classList.remove('hidden');
    showMessage('Galería vaciada correctamente.', '#50fa7b');
  }

  // =============================
  // 🎮 EVENTOS
  // =============================
  addButton.addEventListener('click', addCharacter);
  addSixButton.addEventListener('click', addSixCharacters);
  clearButton.addEventListener('click', clearGallery);
});
