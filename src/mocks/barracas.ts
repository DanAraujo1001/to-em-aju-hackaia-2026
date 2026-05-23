export interface ItemCardapio {
  nome: string;
  preco: number;
}

export interface Barraca {
  id: number;
  nome: string;
  responsavel: string;
  icone: string;
  descricao: string;
  pontosCheckin: number;
  figurinhaId: number;
  cardapio: ItemCardapio[];
}

export const BARRACAS_MOCK: Barraca[] = [
  {
    id: 1,
    nome: "Reino do Milho",
    responsavel: "Família Andrade",
    icone: "🌽",
    descricao:
      "Tudo do milho: pamonha, canjica, mungunzá e curau, preparados na hora.",
    pontosCheckin: 45,
    figurinhaId: 3,
    cardapio: [
      { nome: "Pamonha doce", preco: 10 },
      { nome: "Canjica", preco: 8 },
      { nome: "Milho cozido", preco: 7 },
    ],
  },
  {
    id: 2,
    nome: "Casa dos Licores",
    responsavel: "Dona Conceição",
    icone: "🍯",
    descricao: "Licores artesanais de umbu, caju e maracujá do sertão.",
    pontosCheckin: 40,
    figurinhaId: 1,
    cardapio: [
      { nome: "Licor de Umbu", preco: 15 },
      { nome: "Licor de Caju", preco: 15 },
      { nome: "Licor de Maracujá", preco: 12 },
    ],
  },
  {
    id: 3,
    nome: "Doces da Vovó",
    responsavel: "Família Santos",
    icone: "🥥",
    descricao: "Cocadas, beijinhos e doces típicos feitos com amor.",
    pontosCheckin: 35,
    figurinhaId: 2,
    cardapio: [
      { nome: "Cocada branca", preco: 5 },
      { nome: "Cocada queimada", preco: 5 },
      { nome: "Pé de moleque", preco: 6 },
    ],
  },
];
