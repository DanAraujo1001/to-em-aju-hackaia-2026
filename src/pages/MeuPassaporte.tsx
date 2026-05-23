import React from "react";
import BottomNav from "../components/BottomNav";

interface Recompensa {
  id: number;
  titulo: string;
  subtitulo: string;
  pontosNecessarios: number;
  icone: string;
}

interface Figurinha {
  id: number;
  nome: string;
  icone: string;
  carimbado: boolean;
  bgColor: string;
}

interface MeuPassaporteProps {
  pontos?: number;
  onNavegar: (_tela: "mapa" | "passaporte" | "foto") => void; // TIPAGEM ATUALIZADA
  onResgatarPremio: (_idPremio: number) => void;
  onVoltar?: () => void;
}

export default function MeuPassaporte({
  pontos = 120,
  onNavegar,
  onResgatarPremio,
  onVoltar,
}: MeuPassaporteProps) {
  // Lista de figurinhas do álbum baseada estritamente no mockup
  const figurinhas: Figurinha[] = [
    {
      id: 1,
      nome: "Licores",
      icone: "🍯",
      carimbado: true,
      bgColor: "bg-[#D67128]",
    },
    {
      id: 2,
      nome: "Doces",
      icone: "🥥",
      carimbado: true,
      bgColor: "bg-[#C43A70]",
    },
    {
      id: 3,
      nome: "Milho",
      icone: "🌽",
      carimbado: true,
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
      carimbado: true,
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

  // Lista de recompensas disponíveis baseada no mockup
  const recompensas: Recompensa[] = [
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

  return (
    <div className="min-h-screen w-full bg-[#FAF7F0] text-[#1A1613] font-sans flex justify-center selection:bg-[#FFB800]">
      {/* Container PWA Móvel */}
      <div className="w-full max-w-md bg-[#FAF7F0] min-h-screen flex flex-col relative border-x-2 border-[#1A1613] shadow-xl overflow-x-hidden pb-24">
        {/* === CABEÇALHO SUPERIOR EM DEGRADÊ */}
        <div className="w-full bg-gradient-to-b from-[#E65C00] to-[#FFA800] p-5 pt-7 text-white relative">
          <div className="flex items-center gap-3">
            <button
              onClick={onVoltar}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
            >
              <span className="text-xl font-bold leading-none mt-[-2px]">
                ←
              </span>
            </button>
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-none">
                Meu Passaporte
              </h2>
              <p className="text-xs font-medium opacity-80 mt-1">
                Forró Caju 2026
              </p>
            </div>
          </div>

          {/* === PANEL DE CARD DE PONTOS INJETADO NO DEGRADÊ */}
          <div className="w-full bg-gradient-to-b from-[#FFA800] to-[#FFC436] border-2 border-[#1A1613] rounded-3xl p-5 mt-6 shadow-[4px_4px_0px_0px_#1A1613] text-[#1A1613] relative">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🍂</span>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black tracking-tighter">
                    {pontos}
                  </span>
                  <span className="text-sm font-bold text-[#1A1613]/80">
                    Pontos Caju
                  </span>
                </div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-[#1A1613]/70 uppercase tracking-wide">
                <span>Próximo prêmio: Brinde de artesanato de barro</span>
                <span>205/300</span>
              </div>
              <div className="w-full h-3 bg-[#1A1613]/10 border border-[#1A1613]/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#C84B24] rounded-full w-[68%]" />
              </div>
            </div>
          </div>
        </div>

        {/* === SEÇÃO: ÁLBUM DE FIGURINHAS (4/6) */}
        <div className="px-5 mt-6 space-y-3">
          <h3 className="text-lg font-black tracking-tight text-[#1A1613]">
            Álbum de Figurinhas (4/6)
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {figurinhas.map((fig) => (
              <div
                key={fig.id}
                className={`aspect-square rounded-2xl border-2 border-[#1A1613] p-2 flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_#1A1613] relative overflow-hidden transition-transform active:scale-98
                  ${fig.carimbado ? `${fig.bgColor} text-white` : "bg-[#EAE5DA] text-gray-400"}`}
              >
                {/* Ícone ou Emoji */}
                <span
                  className={`text-3xl ${!fig.carimbado ? "grayscale opacity-40" : ""}`}
                >
                  {fig.icone}
                </span>

                {/* Tag de Validação ou Nome */}
                {fig.carimbado ? (
                  <div className="absolute bottom-2 inset-x-2 border border-dashed border-white/60 bg-black/10 rounded-lg py-0.5 text-[9px] font-black tracking-wider text-center uppercase">
                    ✓ Carimbado
                  </div>
                ) : (
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight mt-1.5">
                    {fig.nome}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* === SEÇÃO: RECOMPENSAS DISPONÍVEIS */}
        <div className="px-5 mt-6 space-y-3">
          <h3 className="text-lg font-black tracking-tight text-[#1A1613]">
            Recompensas Disponíveis
          </h3>

          <div className="space-y-3">
            {recompensas.map((premio) => {
              const bloqueado = pontos < premio.pontosNecessarios;
              return (
                <div
                  key={premio.id}
                  className={`bg-white border-2 border-[#1A1613] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1A1613] flex justify-between items-center transition-all
                    ${bloqueado ? "bg-gray-100/60 opacity-80" : ""}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Thumbnail Redonda */}
                    <div
                      className={`w-12 h-12 rounded-xl border-2 border-[#1A1613] flex items-center justify-center text-2xl shrink-0 shadow-[2px_2px_0px_0px_#1A1613]
                      ${bloqueado ? "bg-gray-200" : "bg-[#FFB800]"}`}
                    >
                      {premio.icone}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#1A1613] leading-snug truncate">
                        {premio.titulo}
                      </h4>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">
                        {premio.subtitulo}
                      </p>
                    </div>
                  </div>

                  {/* Botão Dinâmico de Resgate */}
                  <button
                    disabled={bloqueado}
                    onClick={() => onResgatarPremio(premio.id)}
                    className={`h-9 px-4 border-2 border-[#1A1613] rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#1A1613] transition-all shrink-0 ml-2
                      ${
                        bloqueado
                          ? "bg-[#D1D5DB] text-gray-500 border-gray-400 shadow-none cursor-not-allowed uppercase"
                          : "bg-[#FFB800] text-[#1A1613] hover:bg-[#ffa700] active:translate-y-0.5 active:shadow-none cursor-pointer"
                      }`}
                  >
                    {bloqueado ? "Bloqueado" : "Resgatar"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* === BARRA DE NAVEGAÇÃO INFERIOR (componente compartilhado) === */}
        <BottomNav active="passaporte" onNavegar={onNavegar} />
      </div>
    </div>
  );
}
