import { useState } from 'react';

// O formulário recebe a prop 'onGameAdded' para avisar o App.jsx que um novo jogo foi criado
function GameForm({ onGameAdded }) {
    // --- ESTADOS DO FORMULÁRIO ---
    const [name, setName] = useState('');
    const [platform, setPlatform] = useState('');
    const [status, setStatus] = useState('Quero jogar');
    // ESTADO para guardar a URL da capa vinda da sugestão ou do upload
    const [cover, setCover] = useState('');
    // ESTADO para a lista de sugestões da API da RAWG
    const [suggestions, setSuggestions] = useState([]);
    // Variável para controlar o timer do debounce e evitar múltiplas chamadas à API
    let debounceTimer;

    // URL do nosso backend
    const API_URL = 'https://mynextgame-api.onrender.com/api/games';

    // --- FUNÇÃO CHAMADA QUANDO O USUÁRIO DIGITA NO CAMPO DE NOME ---
    const handleNameChange = (e) => {
        const query = e.target.value;
        setName(query); // Atualiza o estado do nome do jogo

        // Limpa o timer anterior para reiniciar a contagem
        clearTimeout(debounceTimer);

        // Se a busca for muito curta, limpa as sugestões e não faz nada
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        // Inicia um novo timer. A busca só acontece se o usuário parar de digitar por 500ms
        debounceTimer = setTimeout(async () => {
            try {
                // Monta a URL para o nosso endpoint de busca no backend
                const SEARCH_URL = `https://mynextgame-api.onrender.com/api/search-rawg/${query}`;
                const response = await fetch(SEARCH_URL);
                if (!response.ok) return; // Se a resposta não for OK, para a execução
                const data = await response.json();
                setSuggestions(data); // Atualiza o estado com as sugestões recebidas da API
            } catch (error) {
                console.error("Erro ao buscar sugestões:", error);
            }
        }, 500);
    };

    // --- FUNÇÃO CHAMADA QUANDO O FORMULÁRIO É ENVIADO ---
    const handleSubmit = async (event) => {
        event.preventDefault(); // Previne o recarregamento da página

        // Monta o objeto do novo jogo com os dados dos estados, incluindo a capa
        const newGame = { name, platform, status, cover };

        // Faz a chamada POST para o nosso backend para salvar o jogo
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGame),
        });

        // Limpa todos os campos do formulário
        setName('');
        setPlatform('');
        setStatus('Quero jogar');
        setCover(''); // Limpa a URL da capa
        setSuggestions([]); // Limpa a lista de sugestões
        
        // Avisa o componente pai (App.jsx) que a lista precisa ser atualizada
        onGameAdded(); 
    };

    // --- JSX: O HTML QUE O COMPONENTE RENDERIZA ---
    return (
        <section id="form-section">
            <h2>Adicionar Novo Jogo</h2>
            <form onSubmit={handleSubmit}>
                
                {/* ÁREA DE PREVIEW DA CAPA */}
                <div className="preview-container">
                    {/* A imagem só aparece se o estado 'cover' tiver uma URL */}
                    {cover && <img src={cover} alt="Preview da Capa" id="cover-preview" className="visible" />}
                </div>

                <div className="form-group">
                    <label htmlFor="game-name">Nome do Jogo</label>
                    <input 
                        type="text" 
                        id="game-name" 
                        value={name}
                        // O 'onChange' agora chama nossa função de busca
                        onChange={handleNameChange}
                        required 
                        autoComplete="off"
                    />
                    {/* RENDERIZAÇÃO CONDICIONAL DAS SUGESTÕES */}
                    {suggestions.length > 0 && (
                        <div id="suggestions-box">
                            {suggestions.map(suggestion => (
                                <div 
                                    key={suggestion.id} 
                                    className="suggestion-item"
                                    // Ao clicar em uma sugestão...
                                    onClick={() => {
                                        setName(suggestion.name);               // ...preenche o nome no formulário
                                        setCover(suggestion.background_image);  // ...preenche a capa no formulário
                                        setSuggestions([]);                     // ...e fecha a caixa de sugestões
                                    }}
                                >
                                    <img src={suggestion.background_image} alt={`Capa de ${suggestion.name}`} />
                                    <span>{suggestion.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="game-platform">Plataforma</label>
                    <input 
                        type="text" 
                        id="game-platform" 
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="game-status">Status</label>
                    <select 
                        id="game-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="Quero jogar">Quero jogar</option>
                        <option value="Jogando">Jogando</option>
                        <option value="Zerado">Zerado</option>
                        <option value="Platinado">Platinado</option>
                        <option value="Abandonado">Abandonado</option>
                    </select>
                </div>
                <button type="submit">Adicionar Jogo</button>
            </form>
        </section>
    );
}

export default GameForm;