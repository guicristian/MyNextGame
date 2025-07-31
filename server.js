// Passo 1: Importar os pacotes
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Passo 2: Configurações Iniciais
const app = express();
const PORT = 5000;

// Passo 3: String de Conexão
const connectionString = 'mongodb+srv://guicristian:soft2013@cluster0.v6wncdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(connectionString);
let db;

// Passo 4: Conectar ao Banco e Iniciar o Servidor
client.connect()
    .then(() => {
        console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
        db = client.db('my-next-game-db'); 
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro ao conectar ao MongoDB Atlas.');
        console.error(err);
        process.exit(1);
    });

// Passo 5: Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rota de Teste
app.get('/', (req, res) => {
    res.send('A API do MyNextGame está funcionando!');
});

// =================================================================
// Passo 6: Rotas da API de Jogos (Endpoints)
// =================================================================

// GET - BUSCAR TODOS OS JOGOS (READ)
app.get('/api/games', async (req, res) => {
    try {
        const games = await db.collection('games').find().toArray();
        res.json(games);
    } catch (err) {
        console.error("Erro ao buscar jogos:", err);
        res.status(500).json({ message: 'Erro no servidor ao buscar jogos' });
    }
});

// POST - ADICIONAR UM NOVO JOGO (CREATE)
app.post('/api/games', async (req, res) => {
    try {
        const newGame = req.body;
        if (!newGame.name || !newGame.platform) {
            return res.status(400).json({ message: 'Nome e plataforma são obrigatórios.' });
        }
        const result = await db.collection('games').insertOne(newGame);
        res.status(201).json(result);
    } catch (err) {
        console.error("Erro ao adicionar jogo:", err);
        res.status(500).json({ message: 'Erro no servidor ao adicionar jogo' });
    }
});

// DELETE - DELETAR UM JOGO (DELETE)
app.delete('/api/games/:id', async (req, res) => {
    try {
        const gameId = req.params.id;
        if (!ObjectId.isValid(gameId)) {
            return res.status(400).json({ message: 'ID de jogo inválido.' });
        }
        const result = await db.collection('games').deleteOne({ _id: new ObjectId(gameId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }
        res.status(200).json({ message: 'Jogo deletado com sucesso.' });
    } catch (err) {
        console.error("Erro ao deletar jogo:", err);
        res.status(500).json({ message: 'Erro no servidor ao deletar jogo' });
    }
}); // <--- ESTE FECHAMENTO ESTAVA FALTANDO

// ROTA PARA BUSCAR JOGOS NA API DA RAWG (Proxy)
app.get('/api/search-rawg/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const apiKey = process.env.RAWG_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'Chave da API da RAWG não configurada no servidor.' });
        }
        
        const response = await axios.get(`https://api.rawg.io/api/games`, {
            params: {
                key: apiKey,
                search: query,
                page_size: 5 
            }
        });

        res.json(response.data.results);

    } catch (error) {
        console.error("Erro ao buscar na API da RAWG:", error.message);
        res.status(500).json({ message: 'Erro ao buscar dados na API externa.' });
    }
});

// Os fechamentos extras no final do arquivo original foram removidos.