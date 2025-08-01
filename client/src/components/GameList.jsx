// Este componente recebe a lista de jogos e a renderiza
function GameList({ games }) {
  return (
    <div className="games-list-container">
      <h2>Minha Lista de Jogos</h2>
      <div id="games-list">
        {games.map(game => (
          // Para cada jogo, renderizamos um card (ainda simples)
          <div key={game._id} className="game-card">
            <h3>{game.name}</h3>
            <p>{game.platform}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default GameList;