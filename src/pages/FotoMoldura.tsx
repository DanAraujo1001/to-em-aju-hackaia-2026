import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

interface FotoMolduraProps {
  onVoltar: () => void;
  onCompartilhar: (pontos: number) => void;
}

export default function FotoMoldura({
  onVoltar,
  onCompartilhar,
}: FotoMolduraProps) {
  const webcamRef = useRef<Webcam>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);
  const pontosRecompensa = 30;

  // Tira o print do vídeo ao vivo da câmera
  const capturarFoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setFoto(imageSrc);
    }
  }, [webcamRef]);

  // Função avançada: Fundo a foto da câmera com a moldura PNG numa imagem só
  const mesclarImagemEMoldura = async (
    fotoB64: string,
  ): Promise<File | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      // Tamanho quadrado padrão para redes sociais
      canvas.width = 1080;
      canvas.height = 1080;

      const imgCamera = new Image();
      imgCamera.src = fotoB64;

      const imgMoldura = new Image();
      imgMoldura.src = "/moldura.png"; // A imagem que salvamos na pasta public

      imgCamera.onload = () => {
        // 1. Desenha a foto da câmera centralizada e cortada (cover)
        const size = Math.min(imgCamera.width, imgCamera.height);
        const x = (imgCamera.width - size) / 2;
        const y = (imgCamera.height - size) / 2;
        ctx.drawImage(imgCamera, x, y, size, size, 0, 0, 1080, 1080);

        // 2. Desenha a moldura por cima da foto
        imgMoldura.onload = () => {
          ctx.drawImage(imgMoldura, 0, 0, 1080, 1080);

          // 3. Converte a obra de arte pronta em um Arquivo (File) real
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], "caju-foto.png", {
                type: "image/png",
              });
              resolve(file);
            } else {
              resolve(null);
            }
          }, "image/png");
        };
      };
    });
  };

  // Aciona o compartilhamento nativo do celular (WhatsApp, Insta, etc)
  const compartilharReal = async () => {
    if (!foto) return;
    setProcessando(true);

    const arquivoFinal = await mesclarImagemEMoldura(foto);
    setProcessando(false);

    if (
      arquivoFinal &&
      navigator.canShare &&
      navigator.canShare({ files: [arquivoFinal] })
    ) {
      try {
        await navigator.share({
          files: [arquivoFinal],
          title: "Circuito Caju",
          text: "Curtindo o Forró Caju com o Passaporte Digital! 🌽🔥 #TôEmAracaju #ForróCaju",
        });

        // Se deu certo o compartilhamento, entrega os pontos!
        alert(
          `Uhuuul! Compartilhado com sucesso! +${pontosRecompensa} Pontos.`,
        );
        onCompartilhar(pontosRecompensa);
      } catch (error) {
        console.log("Usuário cancelou o compartilhamento ou deu erro.", error);
      }
    } else {
      // PLANO B (Caso seja PC sem suporte a compartilhamento via API)
      if (arquivoFinal) {
        const url = URL.createObjectURL(arquivoFinal);
        const a = document.createElement("a");
        a.href = url;
        a.download = "circuito-caju-foto.png";
        a.click();
        alert(
          `Sua foto foi baixada! Publique nas redes para espalhar o Forró Caju! +${pontosRecompensa} Pontos.`,
        );
        onCompartilhar(pontosRecompensa);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1A1613] to-[#2b241f] flex flex-col items-center relative pb-10 selection:bg-[#FFB800]">
      {/* HEADER */}
      <div className="w-full flex items-center justify-between p-6 z-20">
        <button
          onClick={onVoltar}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl hover:bg-white/20"
        >
          ←
        </button>
        <h2 className="text-xl font-black text-white tracking-tight">
          Câmera Caju
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md px-6 flex flex-col flex-1 z-10">
        {!foto && (
          <div className="text-center mt-2 mb-6 animate-fade-in">
            <h3 className="text-3xl font-black text-[#FFB800] leading-tight drop-shadow-md">
              Ganhe +{pontosRecompensa} Pts!
            </h3>
            <p className="text-white/80 text-sm mt-1 font-medium">
              Encaixe seu rosto e tire a foto!
            </p>
          </div>
        )}

        {/* CONTAINER DA CÂMERA E MOLDURA */}
        <div className="w-full aspect-square relative bg-black rounded-[32px] border-4 border-[#1A1613] overflow-hidden flex items-center justify-center shadow-[4px_4px_0px_0px_#FFB800]">
          {!foto ? (
            <>
              {/* O VÍDEO REAL DA CÂMERA AO VIVO */}
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user", aspectRatio: 1 }} // "user" para câmera frontal, ou "environment" para traseira
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
              {/* MOLDURA SOBREPOSTA NO VÍDEO */}
              <img
                src="/moldura.png"
                alt="Moldura Caju"
                className="absolute inset-0 w-full h-full z-20 pointer-events-none object-cover drop-shadow-2xl"
              />
            </>
          ) : (
            <>
              {/* FOTO TIRADA COM A MOLDURA */}
              <img
                src={foto}
                alt="Sua foto"
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
              <img
                src="/moldura.png"
                alt="Moldura Caju"
                className="absolute inset-0 w-full h-full z-20 pointer-events-none object-cover"
              />
            </>
          )}
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="mt-8 flex flex-col gap-4">
          {!foto ? (
            <button
              onClick={capturarFoto}
              className="w-full h-16 bg-[#FFB800] text-[#1A1613] text-xl font-black rounded-full shadow-[4px_4px_0px_0px_#1A1613] border-4 border-[#1A1613] text-center active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              📸 Tirar Foto
            </button>
          ) : (
            <div className="animate-slide-up flex flex-col gap-3">
              <button
                onClick={compartilharReal}
                disabled={processando}
                className="w-full h-16 bg-gradient-to-r from-[#C84B24] to-[#A33614] text-white text-lg font-black rounded-2xl shadow-[4px_4px_0px_0px_#1A1613] border-4 border-[#1A1613] flex items-center justify-center gap-3 active:translate-y-1 active:shadow-none transition-all"
              >
                {processando
                  ? "Preparando Magia..."
                  : "🚀 Compartilhar Oficial"}
              </button>

              <button
                onClick={() => setFoto(null)}
                className="w-full h-12 bg-transparent text-white font-bold border-2 border-white/30 rounded-2xl flex items-center justify-center uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
              >
                Refazer a Foto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
