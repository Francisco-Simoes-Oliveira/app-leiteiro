/**
 * storageService.js
 * Abstração de armazenamento local (IndexedDB)
 * COMPATÍVEL COM FIREBASE - Fácil substituição futura
 *
 * Funções:
 * - getAll(collection)
 * - getById(collection, id)
 * - create(collection, data)
 * - update(collection, id, data)
 * - remove(collection, id)
 */

const DB_NAME = "app-leiteiro";
const DB_VERSION = 1;

// Lista de coleções (similares às rotas do backend)
const COLLECTIONS = [
  "vacas",
  "producao",
  "medicamentos",
  "sanitario",
  "despesas",
  "usuarios",
];

let db = null;

/**
 * Inicializa o banco de dados IndexedDB
 */
async function initDB() {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(new Error("Erro ao abrir IndexedDB"));
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Criar object stores (tabelas) para cada coleção
      COLLECTIONS.forEach((collection) => {
        if (!database.objectStoreNames.contains(collection)) {
          const store = database.createObjectStore(collection, {
            keyPath: "id",
            autoIncrement: true,
          });
          // Índices úteis
          store.createIndex("createdAt", "createdAt", { unique: false });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      });
    };
  });
}

/**
 * Busca todos os registros de uma coleção
 * @param {string} collection - Nome da coleção
 * @returns {Promise<Array>}
 */
export async function getAll(collection) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(collection, "readonly");
    const store = transaction.objectStore(collection);
    const request = store.getAll();

    request.onerror = () => reject(new Error(`Erro ao buscar ${collection}`));
    request.onsuccess = () => resolve(request.result || []);
  });
}

/**
 * Busca um registro por ID
 * @param {string} collection - Nome da coleção
 * @param {number|string} id - ID do registro
 * @returns {Promise<Object|null>}
 */
export async function getById(collection, id) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(collection, "readonly");
    const store = transaction.objectStore(collection);
    const request = store.get(Number(id));

    request.onerror = () =>
      reject(new Error(`Erro ao buscar ${collection}/${id}`));
    request.onsuccess = () => resolve(request.result || null);
  });
}

/**
 * Cria um novo registro
 * @param {string} collection - Nome da coleção
 * @param {Object} data - Dados do registro
 * @returns {Promise<number>} ID do registro criado
 */
export async function create(collection, data) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(collection, "readwrite");
    const store = transaction.objectStore(collection);

    // Adiciona timestamps
    const record = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const request = store.add(record);

    request.onerror = () => reject(new Error(`Erro ao criar em ${collection}`));
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Atualiza um registro
 * @param {string} collection - Nome da coleção
 * @param {number|string} id - ID do registro
 * @param {Object} data - Dados atualizados
 * @returns {Promise<void>}
 */
export async function update(collection, id, data) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(collection, "readwrite");
    const store = transaction.objectStore(collection);

    // Busca registro existente e atualiza
    const getRequest = store.get(Number(id));

    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      if (!existing) {
        reject(new Error(`Registro não encontrado: ${collection}/${id}`));
        return;
      }

      const updated = {
        ...existing,
        ...data,
        id: Number(id), // Preserva ID
        createdAt: existing.createdAt, // Preserva data de criação
        updatedAt: new Date().toISOString(),
      };

      const updateRequest = store.put(updated);
      updateRequest.onerror = () =>
        reject(new Error(`Erro ao atualizar ${collection}/${id}`));
      updateRequest.onsuccess = () => resolve();
    };

    getRequest.onerror = () =>
      reject(new Error(`Erro ao buscar ${collection}/${id}`));
  });
}

/**
 * Remove um registro
 * @param {string} collection - Nome da coleção
 * @param {number|string} id - ID do registro
 * @returns {Promise<void>}
 */
export async function remove(collection, id) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(collection, "readwrite");
    const store = transaction.objectStore(collection);
    const request = store.delete(Number(id));

    request.onerror = () =>
      reject(new Error(`Erro ao remover ${collection}/${id}`));
    request.onsuccess = () => resolve();
  });
}

/**
 * FUTURO: Aqui serão substituídos os imports acima por:
 * import { getAll, getById, create, update, remove } from 'firebase-admin/firestore';
 *
 * A interface permanecerá a mesma, garantindo compatibilidade com o restante do código.
 */

export const storageService = {
  getAll,
  getById,
  create,
  update,
  remove,
  initDB,
};
