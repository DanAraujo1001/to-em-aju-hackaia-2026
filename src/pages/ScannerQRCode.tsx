import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface ScannerQRCodeProps {
  onFechar: () => void;
  onSucessoScan?: () => void; // Mantém exatamente o padrão do seu projeto
}

export default function ScannerQRCode({
  onFechar,
  onSucessoScan,
}: ScannerQRCodeProps) {
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    // Inicia a câmera traseira do celular de forma nativa e offline
    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 230, height: 230 } },
        (decodedText) => {
          try {
            // O QR Code da placa física da barraca deve conter um JSON, ex: {"id": 1, "pontos": 25}
            const dadosBarraca = JSON.parse(decodedText);

            if (dadosBarraca.id && dadosBarraca.pontos) {
              // Pega o que já está salvo offline no celular ou define o padrão do mockup (120)
              const pontosAtuais = Number(
                localStorage.getItem("caju_pontos") || "120",
              );
              const carimbosAtuais = JSON.parse(
                localStorage.getItem("caju_carimbos") || "[]",
              );

              // Se o usuário ainda não carimbou essa barraca, adiciona os pontos
              if (!carimbosAtuais.includes(dadosBarraca.id)) {
                carimbosAtuais.push(dadosBarraca.id);
                localStorage.setItem(
                  "caju_pontos",
                  String(pontosAtuais + Number(dadosBarraca.pontos)),
                );
                localStorage.setItem(
                  "caju_carimbos",
                  JSON.stringify(carimbosAtuais),
                );
              }

              // Desliga a câmera com segurança e avisa a tela principal
              html5QrCode
                .stop()
                .then(() => {
                  if (onSucessoScan) onSucessoScan();
                })
                .catch(() => {
                  if (onSucessoScan) onSucessoScan();
                });
            }
          } catch (e) {
            setErro(
              "QR Code inválido. Certifique-se de escanear uma barraca do Circuito Caju.",
            );
          }
        },
        () => {
          // Ignora erros de busca de foco para não encher o console
        },
      )
      .catch(() => {
        setErro(
          "Não foi possível acessar a câmera. Verifique as permissões do navegador.",
        );
      });

    // Desliga a câmera automaticamente se o usuário fechar a tela no meio do processo
    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode
          .stop()
          .catch((err) => console.error("Erro ao parar câmera", err));
      }
    };
  }, [onSucessoScan]);

  return (
    <div className="min-h-screen w-full bg-[#1A1613] text-white font-sans flex justify-center selection:bg-[#FFB800] selection:text-[#1A1613]">
      <div className="w-full max-w-md min-h-screen bg-[#131110] flex flex-col justify-between p-6 relative overflow-hidden">
        {/* HEADER DO SCANNER */}
        <div className="flex justify-between items-start mt-4 z-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Escaneando QR Code
            </h2>
            <p className="text-xs font-medium text-gray-400">
              Aponte para o QR da barraca
            </p>
          </div>
          <button
            onClick={onFechar}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-lg hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Fechar Scanner"
          >
            ✕
          </button>
        </div>

        {/* ÁREA CENTRAL: MIRA DA CÂMERA COM O VÍDEO REAL ATRÁS */}
        <div className="flex-1 w-full flex flex-col items-center justify-center p-4 relative">
          {erro && (
            <div className="absolute top-4 bg-red-600/90 text-white text-xs font-bold px-4 py-2 rounded-xl border border-red-700 z-20 text-center max-w-[280px]">
              {erro}
            </div>
          )}

          <div className="w-full max-w-[290px] aspect-square border border-white/20 rounded-[32px] relative bg-black/30 backdrop-blur-xs shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
            {/* Elemento onde a câmera real será renderizada ocupando todo o espaço interno */}
            <div
              id="reader"
              className="absolute inset-0 w-full h-full object-cover [&_video]:object-cover [&_video]:w-full [&_video]:h-full"
            />

            {/* CANTOS GUIA DA MIRA (AMARELO CAJU) POR CIMA DO VÍDEO */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FFB800] rounded-tl-[20px] -mt-[2px] -ml-[2px] z-10" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FFB800] rounded-tr-[20px] -mt-[2px] -mr-[2px] z-10" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FFB800] rounded-bl-[20px] -mb-[2px] -ml-[2px] z-10" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FFB800] rounded-br-[20px] -mb-[2px] -mr-[2px] z-10" />

            {/* LINHA DE LASER ANIMADA */}
            <div className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent top-1/2 -translate-y-1/2 animate-laser-glow shadow-[0_0_12px_#FFB800] z-10" />
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="w-full space-y-3 mb-6 z-10 px-2">
          <p className="text-center text-xs font-bold tracking-wide text-gray-400 bg-white/5 py-3 rounded-2xl">
            🔒 Processamento 100% local e offline seguro.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes laserGlow {
          0%, 100% { transform: translateY(-70px); opacity: 0.4; }
          50% { transform: translateY(70px); opacity: 1; }
        }
        .animate-laser-glow {
          animation: laserGlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
