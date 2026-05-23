export interface Figurinha {
  id: number;
  nome: string;
  icone: string;
  carimbado: boolean;
  bgColor: string;
}

export const FIGURINHAS_MOCK: Figurinha[] = [
  {
    id: 1,
    nome: "Licores",
    icone: "🍯",
    carimbado: false,
    bgColor: "bg-[#D67128]",
  },
  {
    id: 2,
    nome: "Doces",
    icone: "🥥",
    carimbado: false,
    bgColor: "bg-[#C43A70]",
  },
  {
    id: 3,
    nome: "Milho",
    icone: "🌽",
    carimbado: false,
    bgColor: "bg-[#F0B84D]",
  },
  {
    id: 4,
    nome: "Cerâmicas",
    icone: "🏺",
    carimbado: false,
    bgColor: "bg-[#E2E6ED]",
  },
  {
    id: 5,
    nome: "Rendas",
    icone: "🧵",
    carimbado: false,
    bgColor: "bg-[#4D71A8]",
  },
  {
    id: 6,
    nome: "Forrozão",
    icone: "🍲",
    carimbado: false,
    bgColor: "bg-[#E2E6ED]",
  },
];
