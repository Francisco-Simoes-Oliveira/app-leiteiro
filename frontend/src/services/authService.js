/**
 * authService.js
 * Serviço de autenticação local
 * COMPATÍVEL COM FIREBASE - Fácil substituição futura
 *
 * Funções:
 * - register(email, senha, nome)
 * - login(email, senha)
 * - logout()
 * - getCurrentUser()
 * - isAuthenticated()
 */

import { create, getAll } from "./storageService";
import { seedExampleData } from "./seedData";

const SESSION_KEY = "app-leiteiro-session";

/**
 * FUTURO: Usar bcrypt ou crypto nativo do navegador para hash
 * Por enquanto, simples hash para demo
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Converte para inteiro
  }
  return hash.toString(36);
}

/**
 * Registra um novo usuário
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha (será hasheada)
 * @param {string} nome - Nome do usuário
 * @returns {Promise<Object>} Dados do usuário criado
 * @throws {Error} Se email já existir
 */
export async function register(email, senha, nome) {
  if (!email || !senha || !nome) {
    throw new Error("Email, senha e nome são obrigatórios");
  }

  if (senha.length < 6) {
    throw new Error("Senha deve ter no mínimo 6 caracteres");
  }

  // Valida email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email inválido");
  }

  // Busca usuários existentes
  const usuarios = await getAll("usuarios");
  const userExists = usuarios.some(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );

  if (userExists) {
    throw new Error("Email já cadastrado");
  }

  // Cria novo usuário
  const userId = await create("usuarios", {
    email: email.toLowerCase(),
    senha: simpleHash(senha), // FUTURO: usar bcrypt
    nome,
  });

  const usuario = {
    id: userId,
    email: email.toLowerCase(),
    nome,
  };

  // ALTERAÇÃO: Popula com dados de exemplo para novo usuário
  await seedExampleData();

  // Salva sessão automaticamente após registro
  saveSession(usuario);

  return usuario;
}

/**
 * Realiza login
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha
 * @returns {Promise<Object>} Dados do usuário logado
 * @throws {Error} Se credenciais inválidas
 */
export async function login(email, senha) {
  if (!email || !senha) {
    throw new Error("Email e senha são obrigatórios");
  }

  const usuarios = await getAll("usuarios");
  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );

  if (!usuario || usuario.senha !== simpleHash(senha)) {
    throw new Error("Email ou senha incorretos");
  }

  const userData = {
    id: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
  };

  saveSession(userData);
  return userData;
}

/**
 * Realiza logout
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Retorna usuário logado atualmente
 * @returns {Object|null} Dados do usuário ou null
 */
export function getCurrentUser() {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;

  try {
    return JSON.parse(sessionData);
  } catch {
    return null;
  }
}

/**
 * Verifica se usuário está autenticado
 * @returns {boolean}
 */
export function isAuthenticated() {
  return getCurrentUser() !== null;
}

/**
 * Salva sessão no localStorage
 * @private
 */
function saveSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      ...user,
      loginAt: new Date().toISOString(),
    }),
  );
}

/**
 * FUTURO: Integração com Firebase Authentication
 *
 * import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
 * const auth = getAuth();
 *
 * export async function register(email, senha, nome) {
 *   const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
 *   await userCredential.user.updateProfile({ displayName: nome });
 *   return { id: userCredential.user.uid, email, nome };
 * }
 *
 * export async function login(email, senha) {
 *   const userCredential = await signInWithEmailAndPassword(auth, email, senha);
 *   return { id: userCredential.user.uid, email, nome: userCredential.user.displayName };
 * }
 *
 * export function logout() {
 *   signOut(auth);
 * }
 */

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
