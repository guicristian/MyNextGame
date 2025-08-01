// O card agora recebe duas props: o objeto 'game' e a função 'onDelete'
function GameCard({ game, onDelete }) {
    // Tenta criar a imagem da capa, se existir no objeto do jogo
    const coverImage = game.cover ? <img src={game.cover} alt={`Capa de ${game.name}`} className="game-cover-img" /> : '';

    return (
        <div className="game-card">
            {coverImage}
            <h3>{game.name}</h3>
            <p className="platform">{game.platform}</p>
            <p className="status">{game.status}</p>
            <div className="card-actions">
                {/* Ao clicar, o botão chama a função onDelete, passando o ID deste jogo específico */}
                <button className="delete-btn" onClick={() => onDelete(game._id)}>
                    <i className="fas fa-trash-alt"></i> Excluir
                </button>
            </div>
        </div>
    );
}

export default GameCard;