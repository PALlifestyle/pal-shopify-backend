# P.A.L. Shopify Backend

Backend Node.js para integração com Shopify API.

## Setup

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente no `.env`

3. Inicie o servidor:
```bash
npm start
```

## API Endpoints

- `GET /api/health` - Verificar status do servidor
- `GET /api/orders` - Buscar todos os pedidos do Shopify
- `GET /api/orders/:id` - Buscar detalhes de um pedido específico

## Deploy

### Opção 1: Railway
1. Acesse https://railway.app
2. Conecte seu GitHub
3. Selecione este repositório
4. Railway fará deploy automaticamente

### Opção 2: Render
1. Acesse https://render.com
2. Clique em "New +"
3. Selecione "Web Service"
4. Conecte seu GitHub
5. Configure e deploy

### Opção 3: Vercel
1. Acesse https://vercel.com
2. Importe o repositório
3. Selecione "Node.js" como framework
4. Deploy

## Configuração do Frontend

No seu React app, use:

```javascript
const API_URL = 'https://seu-backend-url.com';

// Buscar pedidos
const response = await fetch(`${API_URL}/api/orders`);
const orders = await response.json();
```

## Variáveis de Ambiente Necessárias

- `SHOPIFY_DOMAIN` - Seu domínio Shopify
- `SHOPIFY_CLIENT_ID` - Client ID da app Shopify
- `SHOPIFY_CLIENT_SECRET` - Client Secret da app Shopify
- `PORT` - Porta do servidor (padrão: 3001)
