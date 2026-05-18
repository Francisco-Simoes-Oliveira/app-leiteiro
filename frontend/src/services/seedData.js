/**
 * seedData.js
 * Dados de exemplo para testes
 * Executado na primeira vez que um usuário se registra
 */

import { storageService } from "./storageService";

/**
 * Popula o banco com dados de exemplo
 */
export async function seedExampleData() {
  try {
    // Verifica se já tem dados
    const vacas = await storageService.getAll("vacas");
    if (vacas.length > 0) {
      console.log("Dados de exemplo já existem");
      return;
    }

    console.log("Populando banco com dados de exemplo...");

    // ===== Vacas =====
    const vaca1 = await storageService.create("vacas", {
      nome: "Margarida",
      raca: "Holandesa",
      nascimento: "2020-03-15",
      status: "lactando",
      ultimoCio: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    });

    const vaca2 = await storageService.create("vacas", {
      nome: "Clarice",
      raca: "Jersey",
      nascimento: "2019-06-20",
      status: "lactando",
      ultimoCio: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    });

    const vaca3 = await storageService.create("vacas", {
      nome: "Rosinha",
      raca: "Parda",
      nascimento: "2021-01-10",
      status: "prenha",
      ultimoCio: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    });

    // ===== Produção =====
    const hoje = new Date().toISOString().slice(0, 10);
    const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    await storageService.create("producao", {
      vacaId: vaca1,
      data: hoje,
      litros: 22.5,
      observacao: "Produção normal",
    });

    await storageService.create("producao", {
      vacaId: vaca1,
      data: ontem,
      litros: 23.0,
      observacao: "Sem observações",
    });

    await storageService.create("producao", {
      vacaId: vaca2,
      data: hoje,
      litros: 18.0,
      observacao: "Qualidade excelente",
    });

    await storageService.create("producao", {
      vacaId: vaca3,
      data: hoje,
      litros: 0,
      observacao: "Em repouso (prenha)",
    });

    // ===== Medicamentos =====
    await storageService.create("medicamentos", {
      vacaId: vaca1,
      nome: "Mastite - Tratamento",
      data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      descricao: "Antibiótico para mastite",
      valor: 45.5,
    });

    await storageService.create("medicamentos", {
      vacaId: vaca2,
      nome: "Vacina anual",
      data: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      descricao: "Vacinação de rotina",
      valor: 35.0,
    });

    // ===== Sanitário =====
    const dataProxima = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    await storageService.create("sanitario", {
      vacaId: vaca1,
      nome: "Limpeza de úbere",
      data: hoje,
      intervalo: 1,
      descricao: "Higienização diária",
    });

    await storageService.create("sanitario", {
      vacaId: vaca2,
      nome: "Limpeza do estábulo",
      data: hoje,
      intervalo: 3,
      descricao: "Desinfecção geral",
    });

    await storageService.create("sanitario", {
      vacaId: vaca3,
      nome: "Controle parasitário",
      data: dataProxima,
      intervalo: 30,
      descricao: "Vermífugo e antiparasitário",
    });

    // ===== Despesas =====
    const mesAtual = hoje.slice(0, 7);

    await storageService.create("despesas", {
      data: hoje,
      categoria: "Alimentação",
      descricao: "Ração concentrada",
      valor: 150.0,
    });

    await storageService.create("despesas", {
      data: ontem,
      categoria: "Medicamentos",
      descricao: "Vitaminas e suplementos",
      valor: 85.5,
    });

    await storageService.create("despesas", {
      data: new Date(hoje.split("-")[0] + "-" + mesAtual.split("-")[1] + "-01")
        .toISOString()
        .slice(0, 10),
      categoria: "Manutenção",
      descricao: "Conserto de bomba de água",
      valor: 320.0,
    });

    console.log("✓ Dados de exemplo inseridos com sucesso!");
  } catch (error) {
    console.error("Erro ao popular dados de exemplo:", error);
  }
}
