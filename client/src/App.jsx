import { useState, useEffect } from 'react';
import GameList from './components/GameList';
import GameForm from './components/GameForm'; // Importa o formulário

// A URL base do nosso backend que JÁ ESTÁ ONLINE
const API_URL = 'https://mynextgame-api.onrender.com/api/games';

function App() {
  const [games, setGames] = useState([]);

  // Função para buscar/recarregar os jogos da API
  const fetchGames = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
    }
  };

  // Efeito que busca os dados da API quando a página carrega
  useEffect(() => {
    fetchGames();
  }, []);

  // Função para lidar com a exclusão de um jogo
  const handleDeleteGame = async (gameId) => {
    try {
      // Faz a chamada DELETE para a API
      await fetch(`${API_URL}/${gameId}`, { method: 'DELETE' });
      // Atualiza o estado local para remover o jogo da lista, sem precisar recarregar a página
      setGames(games.filter(game => game._id !== gameId));
    } catch (error) {
      console.error("Erro ao deletar jogo:", error);
    }
  };

  return (
    <main className="container">
      {/* Passamos a função 'fetchGames' para o formulário. 
        Ele vai chamá-la após adicionar um novo jogo.
      */}
      <GameForm onGameAdded={fetchGames} />
      
      {/* Passamos a lista de jogos e a função de deletar para a lista.
        A lista, por sua vez, passará a função para cada card.
      */}
      <GameList games={games} onDelete={handleDeleteGame} />
    </main>
  );
}

export default App;