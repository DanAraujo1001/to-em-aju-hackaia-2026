export interface Recompensa {
  id: number;
  titulo: string;
  subtitulo: string;
  pontosNecessarios: number;
  icone: string;
}

export const RECOMPENSAS_MOCK: Recompensa[] = [
  {
    id: 1,
    titulo: "Copo oficial Circuito Caju",
    subtitulo: "100 pontos",
    pontosNecessarios: 100,
    icone: "🥤",
  },
  {
    id: 2,
    titulo: "15% de desconto na Pousada Caju",
    subtitulo: "120 pontos",
    pontosNecessarios: 120,
    icone: "🏨",
  },
  {
    id: 3,
    titulo: "Brinde de artesanato de barro",
    subtitulo: "300 pontos",
    pontosNecessarios: 300,
    icone: "🏺",
  },
  {
    id: 4,
    titulo: "Camiseta exclusiva do evento",
    subtitulo: "450 pontos",
    pontosNecessarios: 450,
    icone: "👕",
  },
];
