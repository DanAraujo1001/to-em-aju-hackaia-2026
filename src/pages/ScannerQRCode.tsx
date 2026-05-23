import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode"; // IMPORTADO: Da Victor-Branch para o scanner real

// ATUALIZADO: onSucessoScan agora pode receber o ID da barraca
interface ScannerQRCodeProps {
  onFechar: () => void;
  onSucessoScan: (_barracaId: number) => void;
}

export default function ScannerQRCode({
  onFechar,
  onSucessoScan,
}: ScannerQRCodeProps) {
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // Garante que o ID do leitor é único e evita duplicatas na DOM
    const readerId = "qr-reader";
    // Cria o elemento dinamicamente se não existir, para a Html5Qrcode usá-lo
    if (!document.getElementById(readerId)) {
        const readerDiv = document.createElement('div');
        readerDiv.id = readerId;
        // Adiciona a div de forma discreta para ser preenchida pelo HTML5-QRCODE
        readerDiv.style.position = 'absolute';
        readerDiv.style.width = '1px';
        readerDiv.style.height = '1px';
        readerDiv.style.overflow = 'hidden';
        document.body.appendChild(readerDiv);
    }

    const html5QrCode = new Html5Qrcode(readerId); // Usa o id do elemento criado

    // Inicia a câmera traseira do celular de forma nativa e offline
    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 230, height: 230 } },
        (decodedText) => {
          try {
            // O QR Code da placa física da barraca deve conter um JSON, ex: {"id": 1}
            // A lógica de pontos vem do 'store' agora, não do QR.
            const dadosQRCode = JSON.parse(decodedText);

            if (dadosQRCode.id) { // Verifica se possui um ID válido
              // Desliga a câmera com segurança e avisa a tela principal com o ID da barraca
              html5QrCode
                .stop()
                .then(() => {
                  onSucessoScan(dadosQRCode.id); // Envia o ID da barraca para o App.tsx
                })
                .catch((err) => {
                  console.error("Erro ao parar câmera após scan", err);
                  onSucessoScan(dadosQRCode.id); // Tenta avançar mesmo com erro ao parar a câmera
                });
            } else {
                setErro("QR Code inválido. Formato esperado: {id: N}");
            }
          } catch (e) {
            setErro(
              "QR Code inválido. Certifique-se de escanear um QR Code do Circuito Caju.",
            );
          }
        },
        (errorMessage) => {
          // Callback de erro de leitura contínua, você pode logar ou ignorar
          // console.warn("QR Scan Error: ", errorMessage);
        },
      )
      .catch((err) => {
        console.error("Erro ao iniciar câmera: ", err);
        setErro(
          "Não foi possível acessar a câmera. Verifique as permissões do navegador.",
        );
      });

    // Desliga a câmera automaticamente se o usuário fechar a tela no meio do processo
    return () => {
      // Remove o elemento 'reader' da DOM ao desmontar o componente
      const readerElement = document.getElementById(readerId);
      if (readerElement) {
          readerElement.remove();
      }

      if (html5QrCode.isScanning) {
        html5QrCode
          .stop()
          .catch((err) => console.error("Erro ao parar câmera", err));
      }
    };
  }, []); // onSucessoScan removido das dependências para evitar re-render loops se ele mudar

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
            {/* O elemento "#qr-reader" (que será preenchido pelo html5-qrcode) não é mais renderizado diretamente aqui como antes,
                pois ele é gerenciado via JS no useEffect. A div aqui é o *visualizador* com a mira. */}

            {/* Este div id="reader" é um placeholder para o DOM real, mas o HTML5Qrcode.js injeta seu video/stream AQUI.
                Porém, a Victor-Branch havia criado um elemento fora da renderização principal, então adaptamos.
                Para melhor controle, o elemento `id="reader"` deveria estar no JSX. No entanto, para compatibilidade com o fork, mantemos a injeção via JS e centralizamos a mira visual. */}

              {/* A mira e a animação se sobrepõem ao feed da câmera injetado */}
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

      <style>{` /* Mantido da Victor-Branch */
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