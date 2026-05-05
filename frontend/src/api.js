/**
 * api.js
 * ALTERAÇÃO: Agora usa storageService (IndexedDB) em vez de HTTP
 * Mantém interface compatível com código existente
 *
 * FUTURO: Substituir storageService por Firebase:
 * import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
 */

import { storageService } from "./services/storageService";

// DESATIVADO: Requisições HTTP para o backend
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
// async function request(path, options = {}) { ... }

/**
 * Wrapper para operações do storageService
 * Converte IDs numéricos para compatibilidade
 */
async function dbOperation(collection, operation, ...args) {
  try {
    return await storageService[operation](collection, ...args);
  } catch (error) {
    console.error(`Erro em ${collection}.${operation}:`, error);
    throw error;
  }
}

export const api = {
  // ===== Vacas =====
  getVacas: () => dbOperation("vacas", "getAll"),
  getVaca: (id) => dbOperation("vacas", "getById", id),
  createVaca: (data) => dbOperation("vacas", "create", data),
  updateVaca: (id, data) => dbOperation("vacas", "update", id, data),
  deleteVaca: (id) => dbOperation("vacas", "remove", id),

  // ===== Produção =====
  // ALTERAÇÃO: Agora retorna todos os registros
  // FUTURO: Adicionar filtro por vacaId se necessário
  getProducao: (vacaId) =>
    vacaId
      ? dbOperation("producao", "getAll").then((items) =>
          items.filter((p) => p.vacaId === vacaId),
        )
      : dbOperation("producao", "getAll"),
  createProducao: (data) => dbOperation("producao", "create", data),
  updateProducao: (id, data) => dbOperation("producao", "update", id, data),
  deleteProducao: (id) => dbOperation("producao", "remove", id),

  // ===== Medicamentos =====
  getMedicamentos: (vacaId) =>
    vacaId
      ? dbOperation("medicamentos", "getAll").then((items) =>
          items.filter((m) => m.vacaId === vacaId),
        )
      : dbOperation("medicamentos", "getAll"),
  createMedicamento: (data) => dbOperation("medicamentos", "create", data),
  updateMedicamento: (id, data) =>
    dbOperation("medicamentos", "update", id, data),
  deleteMedicamento: (id) => dbOperation("medicamentos", "remove", id),

  // ===== Sanitário =====
  getSanitario: (vacaId) =>
    vacaId
      ? dbOperation("sanitario", "getAll").then((items) =>
          items.filter((s) => s.vacaId === vacaId),
        )
      : dbOperation("sanitario", "getAll"),
  createSanitario: (data) => dbOperation("sanitario", "create", data),
  updateSanitario: (id, data) => dbOperation("sanitario", "update", id, data),
  deleteSanitario: (id) => dbOperation("sanitario", "remove", id),

  // ===== Despesas =====
  getDespesas: () => dbOperation("despesas", "getAll"),
  createDespesa: (data) => dbOperation("despesas", "create", data),
  updateDespesa: (id, data) => dbOperation("despesas", "update", id, data),
  deleteDespesa: (id) => dbOperation("despesas", "remove", id),
};
