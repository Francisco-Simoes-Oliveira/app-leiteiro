# Alterações - Sistema Offline-First com Autenticação Local

## 📋 Resumo das Alterações

Sistema adaptado para funcionar **OFFLINE** com armazenamento local (IndexedDB) e autenticação baseada em email/senha. Estrutura preparada para futura integração com Firebase.

---

## 🆕 Novos Arquivos Criados

### **Serviços**

- **`frontend/src/services/storageService.js`**
  - Abstração de dados com IndexedDB
  - Funções: `getAll()`, `getById()`, `create()`, `update()`, `remove()`
  - Compatível com Firebase (fácil substituição futura)
  - Índices criados automaticamente para performance

- **`frontend/src/services/authService.js`**
  - Autenticação local com email/senha
  - Hash simples (FUTURO: bcrypt)
  - Persistência de sessão em localStorage
  - Validações de email e senha

- **`frontend/src/services/seedData.js`**
  - Popula banco com dados de exemplo
  - Executado automaticamente no primeiro cadastro
  - Inclui: 3 vacas, 4 produções, 2 medicamentos, 3 registros sanitários, 3 despesas

### **Contextos**

- **`frontend/src/contexts/AuthContext.jsx`**
  - Contexto global de autenticação
  - Hook customizado: `useAuth()`
  - Estados: `user`, `loading`, `error`
  - Funções: `register()`, `login()`, `logout()`

### **Componentes**

- **`frontend/src/components/ProtectedRoute.jsx`**
  - Protege rotas que requerem autenticação
  - Redireciona para login se não autenticado
  - Mostra spinner enquanto valida sessão

### **Páginas**

- **`frontend/src/pages/Login.jsx`**
  - Tela de login responsiva
  - Link para cadastro
  - Mensagens de erro claras
  - Design consistente com o app

- **`frontend/src/pages/Register.jsx`**
  - Tela de cadastro com validações
  - Confirmação de senha
  - Link para login
  - Info sobre armazenamento local

---

## ✏️ Arquivos Modificados

### **`frontend/src/App.jsx`**

```diff
ALTERAÇÕES:
+ Envolvido com AuthProvider para gerenciar autenticação global
+ Importado ProtectedRoute para proteger rotas
+ Adicionadas rotas públicas: /login, /register
+ Navbar agora aparece apenas para usuários autenticados
+ Rotas do dashboard envolvidas com ProtectedRoute
```

### **`frontend/src/api.js`**

```diff
ALTERAÇÕES:
+ Desativado código HTTP (comentado, não deletado)
+ Substituído por chamadas ao storageService (IndexedDB)
+ Mantém interface compatível (mesmas funções, mesmo retorno)
+ Filtros por vacaId funcionam em memória
+ Comentários indicando futura integração Firebase
```

### **`frontend/src/components/Navbar.jsx`**

```diff
ALTERAÇÕES:
+ Adicionado hook useAuth() para acessar usuário
+ Exibe nome do usuário logado (👤 Nome)
+ Botão "Sair" funcional que faz logout e redireciona
+ Mantém design original, apenas novo na seção de usuário
```

---

## 🔄 Fluxo de Funcionamento

### **Primeira Vez (Novo Usuário)**

1. Usuário vai para `/register`
2. Preenche nome, email, senha
3. `authService.register()` é chamado
4. Usuário criado no IndexedDB (coleção: `usuarios`)
5. **Dados de exemplo são inseridos automaticamente**
6. Sessão salva em localStorage
7. Redirecionado para Dashboard (`/`)

### **Login (Usuário Existente)**

1. Usuário vai para `/login`
2. Insere email e senha
3. `authService.login()` busca usuário no IndexedDB
4. Hash da senha é validado
5. Sessão salva em localStorage
6. Redirecionado para Dashboard

### **Logout**

1. Usuário clica "Sair" na navbar
2. `logout()` remove sessão de localStorage
3. Redirecionado para `/login`
4. Dados no IndexedDB são preservados

### **Operações (CRUD)**

1. Página chama `api.getVacas()` (exemplo)
2. `api.js` delega para `storageService.getAll('vacas')`
3. `storageService` busca no IndexedDB
4. Dados retornados sem latência (offline)

---

## 🗄️ Estrutura do IndexedDB

```
Database: app-leiteiro (v1)

Collections (Object Stores):
├── usuarios (keyPath: id)
│   ├── email (unique)
│   ├── senha (hash)
│   └── nome
│
├── vacas (keyPath: id)
│   ├── nome
│   ├── raca
│   ├── nascimento
│   ├── status
│   ├── ultimoCio
│   ├── createdAt (índice)
│   └── updatedAt (índice)
│
├── producao (keyPath: id)
│   ├── vacaId
│   ├── data
│   ├── litros
│   ├── observacao
│   └── timestamps
│
├── medicamentos (keyPath: id)
├── sanitario (keyPath: id)
└── despesas (keyPath: id)
```

---

## 🔐 Segurança & Validações

### ✅ Implementado

- Validação de email (regex básico)
- Senha mínimo 6 caracteres
- Hash simples para armazenamento
- Email único por usuário
- Persistência segura em localStorage

### ⚠️ FUTURO (Antes de Produção)

- [ ] Usar bcrypt ou crypto nativo para hash
- [ ] HTTPS obrigatório
- [ ] Expiração de sessão
- [ ] Dois fatores (2FA)
- [ ] Usar `sessionStorage` em vez de `localStorage` (temporário)

---

## 📱 Offline-First

### ✅ Totalmente Funcional Sem Internet

- ✓ Login/Cadastro (após primeiro uso online)
- ✓ Visualizar dados
- ✓ Criar/Editar/Deletar registros
- ✓ Todos os dados persistem no navegador

### 🔄 Sincronização (FUTURO)

Quando implementar Firebase:

- [ ] Detectar conexão
- [ ] Enfileirar mudanças offline
- [ ] Sincronizar quando voltar online
- [ ] Resolver conflitos (se houver)

---

## 🔮 Preparação para Firebase

Todos os arquivos de serviço têm comentários indicando as mudanças necessárias:

**storageService.js** → Substituir por:

```javascript
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
// Interface permanece igual
```

**authService.js** → Substituir por:

```javascript
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// Interface permanece igual
```

**api.js** → Apenas remover comentário que desativa HTTP, manter operações como estão.

---

## 🧪 Testando o Sistema

### **Primeira Vez**

1. Abrir app em novo navegador ou modo privado
2. Clicar em "Cadastre-se"
3. Preencher dados (email: `teste@example.com`, senha: `123456`, nome: `Teste`)
4. Dashboard carrega com dados de exemplo

### **Testar Offline**

1. Login normalmente
2. Abrir DevTools → Network → Offline
3. Navegar entre páginas e criar registros
4. Tudo funciona sem internet!

### **Testar Dados Persistem**

1. Login
2. Fechar aba
3. Abrir nova aba e ir para `http://localhost:5173`
4. Dados ainda estão lá (localStorage + IndexedDB)

---

## 📊 Arquivos que NÃO Foram Alterados

- ✓ `frontend/src/pages/Dashboard.jsx` (funcionará igual)
- ✓ `frontend/src/pages/Vacas.jsx` (funcionará igual)
- ✓ `frontend/src/pages/Producao.jsx` (funcionará igual)
- ✓ `frontend/src/pages/Sanitario.jsx` (funcionará igual)
- ✓ `frontend/src/pages/Despesas.jsx` (funcionará igual)
- ✓ `frontend/src/components/LoadingSpinner.jsx`
- ✓ `frontend/src/components/AlertBadge.jsx`
- ✓ Styles (Tailwind CSS)
- ✓ Backend (pode continuar desativado)

---

## 🚀 Próximos Passos Opcionais

1. **Sincronização com Firebase** → Use os comentários como guia
2. **Backup/Export de Dados** → Adicionar botão de download
3. **Autenticação Social** → Google, GitHub
4. **2FA** → Autenticação de dois fatores
5. **Dark Mode** → Tema escuro
6. **Multilíngue** → Suporte a outras línguas

---

## 📝 Notas para Desenvolvedor

- Comentários marcados com `ALTERAÇÃO:` indicam mudanças feitas
- Comentários marcados com `FUTURO:` indicam o que precisa ser feito antes de produção
- Não foram deletados arquivos, apenas adaptados
- Código anterior foi comentado, não removido
- Todas as interfaces foram mantidas compatíveis

---

**Status:** ✅ **SISTEMA OFFLINE-FIRST COMPLETO**

- Data: 5 de maio de 2026
- Versão: 1.0.0
- Compatibilidade: Firefox, Chrome, Safari, Edge (IndexedDB suportado)
