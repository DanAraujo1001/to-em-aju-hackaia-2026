import { useState, useEffect } from "react";
import { type Recompensa } from "../mocks/recompensas";

interface ResgatePremioProps {
  premio: Recompensa | null;
  onVoltar: () => void;
}

export default function ResgatePremio({
  premio,
  onVoltar,
}: ResgatePremioProps) {
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFA800] via-[#E65C00] to-[#C84B24] flex justify-center selection:bg-[#1A1613] selection:text-white">
      <div className="w-full max-w-md min-h-screen flex flex-col p-6 relative overflow-y-auto pb-10">
        {/* === HEADER === */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={onVoltar}
            className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-2xl hover:bg-white/40 transition-colors cursor-pointer"
          >
            ←
          </button>
          <div>
            <h2 className="text-2xl font-black text-white leading-none tracking-tight">
              Resgate do Prêmio
            </h2>
            <p className="text-xs text-white/80 font-medium mt-1">
              Apresente ao atendente
            </p>
          </div>
        </div>

        {/* === PREVIEW DO PRÊMIO === */}
        <div className="flex flex-col items-center mt-8 text-center">
          <div className="w-32 h-32 bg-[#FAF7F0] border-2 border-[#1A1613] rounded-2xl p-3 shadow-[4px_4px_0px_0px_#1A1613] mb-4 flex items-center justify-center relative">
            <span className="text-6xl">{premio?.icone ?? "🎁"}</span>
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-full border border-[#1A1613]">
              DISPONÍVEL
            </div>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight leading-tight">
            {premio?.titulo ?? "Prêmio"}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm font-black text-white bg-[#1A1613] px-2 py-0.5 rounded-lg">
              {premio?.subtitulo ?? ""}
            </span>
          </div>
        </div>

        {/* === QR CODE === */}
        <div className="mt-8 flex flex-col items-center">
          <div className="bg-white border-4 border-[#1A1613] rounded-[40px] p-8 shadow-[8px_8px_0px_0px_#1A1613] flex flex-col items-center w-full max-w-[320px] transition-transform hover:scale-102">
            <svg
              className="w-full aspect-square text-[#1A1613]"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10z" />
              <path d="M40 0h10v10H40zM55 0h5v5h-5zM40 20h10v5H40zM0 40h10v10H0zM20 40h5v5h-5zM40 40h20v20H40zM70 40h10v10H70zM90 40h10v10H90zM0 55h5v5H0zM15 55h10v5H15zM70 55h5v15H70zM85 55h15v5H85zM40 70h10v10H40zM60 70h5v5h-5zM80 70h20v5H80zM55 85h15v15H55zM85 85h5v5h-5zM95 95h5v5H95z" />
            </svg>
          </div>

          <div className="mt-6 flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full text-white text-[11px] font-bold border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            QR válido por {timer}s - regenera automaticamente
          </div>
        </div>

        {/* === LOCAL DE RETIRADA === */}
        <div className="mt-10 bg-[#FFB800] border-2 border-[#1A1613] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#1A1613] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1613]/70">
              Local de retirada
            </span>
          </div>
          <p className="text-sm font-black text-[#1A1613] leading-tight text-center">
            Stand Oficial ao lado do Palco Luiz Gonzaga
          </p>
        </div>

        {/* === BOTÃO VOLTAR === */}
        <button
          onClick={onVoltar}
          className="mt-8 text-white font-black text-xs uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
        >
          <span>←</span> Voltar ao Mapa
        </button>
      </div>
    </div>
  );
}
