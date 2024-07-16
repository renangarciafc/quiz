const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Habilita CORS para todas as rotas

const DEEPL_API_KEY = 'b6b8eaf4-4006-4f44-bd95-2671017bdbce:fx'; // Substitua pelo sua chave de API real
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

app.use(express.json()); // Para parsear o corpo das requisições POST em JSON

// Rota para tradução
app.post('/translate', async (req, res) => {
  try {
    const response = await axios.post(DEEPL_API_URL, req.body, {
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao se comunicar com a API do DeepL', error: error.message });
  }
});

const PORT = 3000; // Porta em que o servidor vai rodar
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});