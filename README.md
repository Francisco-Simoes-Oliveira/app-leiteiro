# 🐄 App Leiteiro

Sistema web para gestão de produção leiteira.

## Funcionalidades

- **Vacas**: Cadastro, edição e listagem com controle de cio
- **Produção de Leite**: Registro diário com histórico e médias
- **Controle Sanitário**: Vermífugo, carrapato, vacinas com alertas de próxima aplicação
- **Despesas**: Registro por tipo com somatório mensal
- **Dashboard**: Visão geral com alertas visuais

## Tecnologias

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Banco de dados**: Firebase Firestore

## Estrutura

```
├── frontend/   # React app (Vite)
└── backend/    # API Express
```

## Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Preencha as variáveis do Firebase no .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Ajuste VITE_API_URL se necessário
npm run dev
```

## API Endpoints

| Método | Rota              | Descrição              |
|--------|-------------------|------------------------|
| GET    | /vacas            | Lista todas as vacas   |
| POST   | /vacas            | Cria nova vaca         |
| PUT    | /vacas/:id        | Atualiza vaca          |
| DELETE | /vacas/:id        | Remove vaca            |
| GET    | /producao         | Lista produção         |
| POST   | /producao         | Registra produção      |
| GET    | /medicamentos     | Lista medicamentos     |
| POST   | /medicamentos     | Registra medicamento   |
| GET    | /sanitario        | Lista registros        |
| POST   | /sanitario        | Registra controle      |
| GET    | /despesas         | Lista despesas         |
| POST   | /despesas         | Registra despesa       |
