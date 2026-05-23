import { useState, useEffect } from "react";
import { type Recompensa } from "../mocks/recompensas";
import { QRCodeSVG } from "qrcode.react"; // Importado da Victor-Branch

interface ResgatePremioProps {
  premio: Recompensa | null; // MANTIDO: Receberá o objeto do prêmio
  onVoltar: () => void;
  onConfirmarResgate: () => void; // ATUALIZADO: Não recebe o custo, pois a lógica de pontos está no store
}

export default function ResgatePremio({
  premio,
  onVoltar,
  onConfirmarResgate,
}: ResgatePremioProps) {
  const [timer, setTimer] = useState(59);
  const [qrPayload, setQrPayload] = useState("");

  useEffect(() => {
    // Lógica do timer (mantida da main)
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 59));
    }, 1000);

    // Geração do Payload do QR Code (adaptado da Victor-Branch, usando `premio` da main)
    if (premio) {
      const payload = {
        tipo: "RESGATE_BRINDE",
        premio: premio.titulo,
        custo: premio.pontosNecessarios,
        hashUnico:
          "CAJU-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      };
      setQrPayload(JSON.stringify(payload));
    }

    return () => clearInterval(interval);
  }, [premio]); // Dependência adicionada para reagir a mudanças no prêmio

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFA800] via-[#E65C00] to-[#C84B24] flex justify-center selection:bg-[#1A1613] selection:text-white">
      <div className="w-full max-w-md min-h-screen flex flex-col p-6 relative overflow-y-auto pb-10">
        {/* === HEADER === */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={onVoltar}
            className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-2xl"
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
            <span className="text-6xl">{premio?.icone ?? "🎁"}</span> {/* Usando o ícone do prêmio */}
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-full border border-[#1A1613]">
              DISPONÍVEL
            </div>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight leading-tight">
            {premio?.titulo ?? "Prêmio"}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm font-black text-white bg-[#1A1613] px-2 py-0.5 rounded-lg">
              {premio?.subtitulo ?? ""} {/* Usando o subtítulo do prêmio */}
            </span>
          </div>
        </div>

        {/* === CONTAINER DO QR CODE === */}
        <div className="mt-8 flex flex-col items-center">
          <div className="bg-white border-4 border-[#1A1613] rounded-[40px] p-8 shadow-[8px_8px_0px_0px_#1A1613] flex flex-col items-center w-full max-w-[280px]"> {/* Max width ajustado do Victor-Branch */}
            {qrPayload ? (
              <div className="w-full aspect-square flex items-center justify-center">
                <QRCodeSVG // Usando o componente QRCodeSVG
                  value={qrPayload}
                  size={180}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  fgColor="#1A1613"
                />
              </div>
            ) : (
              <div className="w-[180px] h-[180px] bg-gray-200 animate-pulse rounded-xl" />
            )}
          </div>
          <div className="mt-4 text-white text-[11px] font-bold text-center"> {/* Estilo do Victor-Branch */}
            QR válido por{" "}<span>{timer}s</span> - regenera automaticamente
          </div>
        </div>

        {/* === BOTÃO DE PITCH (Simula o sistema do Stand de Brindes) === */}
        {/* Reutiliza o botão de simular do Victor-Branch, adaptado para o props onConfirmarResgate da main */}
        <button
          onClick={onConfirmarResgate} // Usa a nova prop
          className="mt-8 bg-[#1A1613] text-white border-2 border-white rounded-2xl p-4 font-black shadow-[4px_4px_0px_0px_white] hover:translate-y-1 hover:shadow-none transition-all w-full"
        >
          👨‍💼 Simular "Bipe" do Atendente (Confirmar Resgate)
        </button>

        {/* === LOCAL DE RETIRADA === */}
        <div className="mt-6 bg-[#FFB800] border-2 border-[#1A1613] rounded-3xl p-4 shadow-[4px_4px_0px_0px_#1A1613] flex flex-col gap-3 text-center">
          <p className="text-sm font-black text-[#1A1613] leading-tight">
            📍 Stand Oficial ao lado do Palco Luiz Gonzaga
          </p>
        </div>

        {/* === BOTÃO VOLTAR === */}
        <button
          onClick={onVoltar} // onVoltar já estava presente
          className="mt-8 text-white font-black text-xs uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
        >
          <span>←</span> Voltar ao Passaporte
        </button>
      </div>
    </div>
  );
}