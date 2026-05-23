import BottomNav from "../components/BottomNav";
import { type Figurinha } from "../mocks/figurinhas";
import { type Recompensa } from "../mocks/recompensas";

interface MeuPassaporteProps {
  pontos: number;
  figurinhas: Figurinha[];
  recompensas: Recompensa[];
  premiosResgatados: number[];
  proximoPremio: Recompensa | null;
  progressoProximoPremio: number;
  totalFigurinhasCarimbadas: number;
  onNavegar: (_tela: "mapa" | "passaporte") => void;
  onResgatarPremio: (_idPremio: number) => void;
  onVoltar?: () => void;
}

export default function MeuPassaporte({
  pontos,
  figurinhas,
  recompensas,
  premiosResgatados,
  proximoPremio,
  progressoProximoPremio,
  totalFigurinhasCarimbadas,
  onNavegar,
  onResgatarPremio,
  onVoltar,
}: MeuPassaporteProps) {
  return (
    <div className="min-h-screen w-full bg-[#FAF7F0] text-[#1A1613] font-sans flex justify-center selection:bg-[#FFB800]">
      <div className="w-full max-w-md bg-[#FAF7F0] min-h-screen flex flex-col relative border-x-2 border-[#1A1613] shadow-xl overflow-x-hidden pb-24">
        {/* === CABEÇALHO === */}
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

          {/* Card de Pontos */}
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

            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-[#1A1613]/70 uppercase tracking-wide">
                {proximoPremio ? (
                  <>
                    <span>Próximo prêmio: {proximoPremio.titulo}</span>
                    <span>
                      {pontos}/{proximoPremio.pontosNecessarios}
                    </span>
                  </>
                ) : (
                  <span>🎉 Todos os prêmios desbloqueados!</span>
                )}
              </div>
              <div className="w-full h-3 bg-[#1A1613]/10 border border-[#1A1613]/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C84B24] rounded-full transition-all duration-500"
                  style={{ width: `${progressoProximoPremio}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* === ÁLBUM DE FIGURINHAS === */}
        <div className="px-5 mt-6 space-y-3">
          <h3 className="text-lg font-black tracking-tight text-[#1A1613]">
            Álbum de Figurinhas ({totalFigurinhasCarimbadas}/{figurinhas.length}
            )
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {figurinhas.map((fig) => (
              <div
                key={fig.id}
                className={`aspect-square rounded-2xl border-2 border-[#1A1613] p-2 flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_#1A1613] relative overflow-hidden transition-transform active:scale-98
                  ${fig.carimbado ? `${fig.bgColor} text-white` : "bg-[#EAE5DA] text-gray-400"}`}
              >
                <span
                  className={`text-3xl ${!fig.carimbado ? "grayscale opacity-40" : ""}`}
                >
                  {fig.icone}
                </span>

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

        {/* === RECOMPENSAS === */}
        <div className="px-5 mt-6 space-y-3">
          <h3 className="text-lg font-black tracking-tight text-[#1A1613]">
            Recompensas Disponíveis
          </h3>

          <div className="space-y-3">
            {recompensas.map((premio) => {
              const bloqueado = pontos < premio.pontosNecessarios;
              const jaResgatado = premiosResgatados.includes(premio.id);

              return (
                <div
                  key={premio.id}
                  className={`bg-white border-2 border-[#1A1613] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1A1613] flex justify-between items-center transition-all
                    ${bloqueado ? "opacity-80" : ""}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl border-2 border-[#1A1613] flex items-center justify-center text-2xl shrink-0 shadow-[2px_2px_0px_0px_#1A1613]
                        ${jaResgatado ? "bg-green-100" : bloqueado ? "bg-gray-200" : "bg-[#FFB800]"}`}
                    >
                      {jaResgatado ? "✅" : premio.icone}
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

                  <button
                    disabled={bloqueado || jaResgatado}
                    onClick={() => onResgatarPremio(premio.id)}
                    className={`h-9 px-4 border-2 border-[#1A1613] rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#1A1613] transition-all shrink-0 ml-2
                      ${
                        jaResgatado
                          ? "bg-green-100 text-green-700 border-green-300 shadow-none cursor-not-allowed"
                          : bloqueado
                            ? "bg-[#D1D5DB] text-gray-500 border-gray-400 shadow-none cursor-not-allowed uppercase"
                            : "bg-[#FFB800] text-[#1A1613] hover:bg-[#ffa700] active:translate-y-0.5 active:shadow-none cursor-pointer"
                      }`}
                  >
                    {jaResgatado
                      ? "Resgatado"
                      : bloqueado
                        ? "Bloqueado"
                        : "Resgatar"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <BottomNav active="passaporte" onNavegar={onNavegar} />
      </div>
    </div>
  );
}
