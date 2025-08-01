// CÓDIGO CORRETO PARA O script.js (FRONTEND)

document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'https://mynextgame-api.onrender.com/api/games';
    const gameForm = document.getElementById('add-game-form');
    const gamesListContainer = document.getElementById('games-list');
    const coverInput = document.getElementById('game-cover');
    const coverPreview = document.getElementById('cover-preview');

    const loadGames = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Erro ao carregar jogos.');
            return await response.json();
        } catch (error) {
            console.error('Falha na requisição ao carregar jogos:', error);
            gamesListContainer.innerHTML = '<p>Não foi possível carregar os jogos. O servidor backend está rodando?</p>';
            return [];
        }
    };

    const saveGame = async (game) => {
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(game),
            });
        } catch (error) {
            console.error('Falha ao salvar o jogo:', error);
        }
    };

    const deleteGame = async (gameId) => {
        try {
            await fetch(`${API_URL}/${gameId}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Falha ao deletar o jogo:', error);
        }
    };

    const renderGames = async () => {
        const games = await loadGames();
        gamesListContainer.innerHTML = '';
        if (games.length === 0) {
            gamesListContainer.innerHTML = '<p>Nenhum jogo na lista. Adicione o primeiro!</p>';
            return;
        }
        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            const coverImage = game.cover ? `<img src="${game.cover}" alt="Capa de ${game.name}" class="game-cover-img">` : '';
            gameCard.innerHTML = `
                ${coverImage}
                <h3>${game.name}</h3>
                <p class="platform">${game.platform}</p>
                <p class="status">${game.status}</p>
                <div class="card-actions">
                    <button class="delete-btn" data-id="${game._id}" title="Excluir Jogo">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </div>
            `;
            gamesListContainer.appendChild(gameCard);
        });
        addDeleteEventListeners();
    };

    const handleAddGame = async (event) => {
        event.preventDefault();
        const name = document.getElementById('game-name').value;
        const platform = document.getElementById('game-platform').value;
        const status = document.getElementById('game-status').value;
        const cover = coverPreview.src;
        const newGame = { name, platform, status, cover };
        await saveGame(newGame);
        renderGames();
        gameForm.reset();
        coverPreview.src = '';
        coverPreview.classList.remove('visible');
    };

    const handleDeleteGame = async (event) => {
        const buttonClicked = event.currentTarget;
        const gameId = buttonClicked.getAttribute('data-id');
        await deleteGame(gameId);
        renderGames();
    };

    const addDeleteEventListeners = () => {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteGame);
        });
    };

    coverInput.addEventListener('change', () => {
        const file = coverInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                coverPreview.src = e.target.result;
                coverPreview.classList.add('visible');
            };
            reader.readAsDataURL(file);
        }
    });

    const gameNameInput = document.getElementById('game-name');
    const suggestionsBox = document.getElementById('suggestions-box');
    let debounceTimer;

    gameNameInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = gameNameInput.value;
        if (query.length < 3) {
            suggestionsBox.innerHTML = '';
            return;
        }
        debounceTimer = setTimeout(async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/search-rawg/${query}`);
                if (!response.ok) return;
                const suggestions = await response.json();
                suggestionsBox.innerHTML = '';
                suggestions.forEach(game => {
                    const item = document.createElement('div');
                    item.classList.add('suggestion-item');
                    item.innerHTML = `<img src="${game.background_image}" alt=""><span>${game.name}</span>`;
                    item.addEventListener('click', () => {
                        gameNameInput.value = game.name;
                        coverPreview.src = game.background_image;
                        coverPreview.classList.add('visible');
                        suggestionsBox.innerHTML = '';
                    });
                    suggestionsBox.appendChild(item);
                });
            } catch (error) {
                console.error('Erro ao buscar sugestões:', error);
            }
        }, 500);
    });

    gameForm.addEventListener('submit', handleAddGame);
    renderGames();
});