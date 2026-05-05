# 🚀 Guia de Execução - App Leiteiro (Versão Offline)

## ✅ Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn

---

## 🏃 Como Executar

### **1. Instalar Dependências (Primeira Vez)**

```bash
# Frontend
cd frontend
npm install

# Backend (opcional - não é necessário para offline)
cd ../backend
npm install
```

### **2. Executar o App**

**Frontend (RECOMENDADO - É o app offline)**

```bash
cd frontend
npm run dev
```

Abrirá em: `http://localhost:5173`

---

## 🧪 Testando o Sistema

### **Cenário 1: Novo Usuário**

1. Acesse `http://localhost:5173`
2. Será redirecionado para `/login`
3. Clique em "Cadastre-se"
4. Preencha:
   - Nome: `João da Silva`
   - Email: `joao@example.com`
   - Senha: `123456`
5. **Dashboard carrega automaticamente com dados de exemplo!**

### **Cenário 2: Usuário Existente**

1. Acesse `http://localhost:5173`
2. Login com credenciais anteriores
3. Clique em "Sair" para logout

### **Cenário 3: Testar Offline**

1. Faça login
2. Abra DevTools (F12)
3. Vá para aba **Network**
4. Clique no ícone de câmera 📷 e selecione **Offline**
5. Navegue pelo app - tudo continua funcionando!
6. Crie/edite/delete registros
7. Reconecte (desativar Offline)
8. Dados continuam lá (persiste no navegador)

### **Cenário 4: Testar Persistência**

1. Login e crie alguns dados
2. **Feche completamente a aba**
3. Abra uma nova aba e vá para o app
4. Faça login novamente
5. **Seus dados estão lá!** (salvos em IndexedDB)

---

## 📊 Dados de Exemplo

Ao se cadastrar, o sistema automaticamente insere:

### **Vacas**

- Margarida (Holandesa, lactando)
- Clarice (Jersey, lactando)
- Rosinha (Parda, prenha)

### **Produção**

- Registros de hoje e ontem para cada vaca

### **Medicamentos**

- Tratamento de mastite
- Vacina anual

### **Sanitário**

- Limpeza diária de úbere
- Limpeza de estábulo
- Controle parasitário

### **Despesas**

- Ração, medicamentos, manutenção

---

## 🛠️ Estrutura de Pastas (Novo)

```
frontend/src/
├── services/
│   ├── storageService.js     ← IndexedDB abstrato
│   ├── authService.js        ← Autenticação local
│   └── seedData.js           ← Dados de exemplo
├── contexts/
│   └── AuthContext.jsx       ← Context global
├── components/
│   ├── ProtectedRoute.jsx    ← Proteção de rotas
│   └── [outros componentes]
├── pages/
│   ├── Login.jsx             ← Nova página
│   ├── Register.jsx          ← Nova página
│   └── [outras páginas]
└── api.js                    ← Adaptado para IndexedDB
```

---

## 🔐 Detalhes de Segurança

### Armazenamento

- **Usuários**: IndexedDB (hashed)
- **Sessão**: localStorage
- **Dados**: IndexedDB

### Validações

- Email único
- Senha mínimo 6 caracteres
- Email válido (regex)

---

## 🐛 Troubleshooting

### **"Erro ao abrir IndexedDB"**

- Limpar cache do navegador (Ctrl+Shift+Delete)
- Tentar em janela privada/incógnita

### **"Dados não salvam"**

- Verificar se localStorage está ativado
- Verificar espaço em disco do navegador

### **"Login não funciona"**

- Verificar se email está correto (case-insensitive)
- Senha deve ter no mínimo 6 caracteres

### **"Navbar não mostra"**

- Se houver erro, checar DevTools (F12 → Console)
- Fazer logout e login novamente

---

## 📝 Variáveis de Ambiente

Nenhuma necessária para offline! O app funciona sem `.env`

Se integrar Firebase no futuro, criar `frontend/.env.local`:

```
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxx
VITE_FIREBASE_PROJECT_ID=xxxxx
# ... etc
```

---

## 🎯 Status Atual

✅ **Sistema Totalmente Funcional Offline**

- Autenticação local com email/senha
- Armazenamento em IndexedDB
- Dados persistem no navegador
- Sem conexão com internet necessária
- Preparado para futura integração Firebase

⚠️ **Antes de Produção**

- [ ] Implementar bcrypt para hash de senha
- [ ] Usar HTTPS
- [ ] Expiração de sessão
- [ ] Rate limiting em login
- [ ] Validações no servidor (quando tiver)

---

## 💡 Dicas

1. **Dados de teste estão sempre disponíveis**
   - Novo usuário = dados de exemplo automáticos

2. **Testar com múltiplos usuários**
   - Criar conta A, fazer logout
   - Criar conta B, fazer login
   - Cada usuário tem seus dados separados!

3. **Limpar dados completamente**
   - DevTools → Application → Storage → IndexedDB → Delete Database
   - Ou criar novo usuário

4. **Para debug**
   - DevTools → Console → `localStorage`
   - DevTools → Application → IndexedDB → app-leiteiro

---

## 📞 Suporte

Para problemas:

1. Checar console do navegador (F12)
2. Limpar cache (Ctrl+Shift+Delete)
3. Testar em janela privada
4. Verificar se navegador suporta IndexedDB

---

**Versão:** 1.0.0 Offline-First  
**Última atualização:** 5 de maio de 2026  
**Status:** ✅ Pronto para uso
