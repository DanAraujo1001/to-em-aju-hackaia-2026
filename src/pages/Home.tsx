import { useState } from "react";
import iconeCarteira from "../assets/icons/carteira.svg";
import iconePontoCaju from "../assets/icons/ponto-caju.svg";
import iconeQr from "../assets/icons/qr-code.svg";
import BottomNav from "../components/BottomNav";
import { type Barraca } from "../mocks/barracas";
import { LUGARES_MOCK, type Lugar } from "../mocks/lugares"; // Re-importado

interface HomeProps {
  pontos: number;
  perfilAtivo: string;
  barracas: Barraca[]; // MANTIDO: Vindo do `useAppStore` para renderizar no mapa
  checkins: number[]; // MANTIDO: Vindo do `useAppStore` para verificar checkins
  onNavegar: (_tela: "mapa" | "passaporte" | "foto") => void; // ATUALIZADO: Inclui 'foto'
  onOpenScanner: () => void;
  onFazerCheckin: (_barracaId: number) => void; // MANTIDO: Função para o `useAppStore`
}

export default function Home({
  pontos = 0,
  perfilAtivo = "Rota Acessível",
  barracas,
  checkins,
  onNavegar,
  onOpenScanner,
  onFazerCheckin,
}: HomeProps) {
  const [barracaSelecionada, setBarracaSelecionada] =
    useState<Barraca | null>(null);
  const [lugarSelecionado, setLugarSelecionado] = useState<Lugar | null>(null); // Re-incluído da última refatoração
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const handleAbrirBarraca = (barraca: Barraca) => {
    setBarracaSelecionada(barraca);
    setLugarSelecionado(null); // Garante que apenas um tipo de item esteja ativo
    setIsMenuOpen(true);
  };

  const handleAbrirLugar = (lugar: Lugar) => { // Re-incluído
    setLugarSelecionado(lugar);
    setBarracaSelecionada(null); // Garante que apenas um tipo de item esteja ativo
    setIsMenuOpen(true);
  };

  const handleFecharDrawer = () => {
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setIsMenuOpen(false);
    setBarracaSelecionada(null);
    setLugarSelecionado(null); // Re-incluído: Limpa lugar também
  };

  const handleTextToSpeech = () => {
    let textoDescricao = "";

    if (barracaSelecionada) {
      textoDescricao = `${barracaSelecionada.nome}, por ${barracaSelecionada.responsavel}. ${barracaSelecionada.descricao}`;
    } else if (lugarSelecionado) { // Re-incluído
      textoDescricao = `${lugarSelecionado.nome}. ${lugarSelecionado.descricaoDetalhada}`;
    } else {
        return;
    }

    if ("speechSynthesis" in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        setIsPlayingAudio(true);
        const utterance = new SpeechSynthesisUtterance(textoDescricao);
        utterance.lang = "pt-BR";
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsPlayingAudio(!isPlayingAudio);
      if (!isPlayingAudio) setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  const handleCheckin = () => {
    if (!barracaSelecionada) return;
    onFazerCheckin(barracaSelecionada.id);
    handleFecharDrawer();
  };

  const jaFezCheckin = barracaSelecionada
    ? checkins.includes(barracaSelecionada.id)
    : false;

  return (
    <div
      className={`min-h-screen w-full bg-[#FAF7F0] text-[#1A1613] font-sans flex justify-center selection:bg-[#FFB800] ${isHighContrast ? "contrast-125" : ""}`}
    >
      <div className="w-full bg-[#FAF7F0] min-h-screen flex flex-col relative border-x-2 border-[#1A1613] shadow-xl overflow-hidden">
        {/* === HEADER === */}
        <div className="w-full bg-gradient-to-r from-[#FFA800] to-[#E65C00] p-4 pt-6 rounded-b-3xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex justify-between items-center z-20">
          <div className="bg-[#0066CC] text-white border-2 border-[#1A1613] px-4 py-2 rounded-xl font-bold text-sm shadow-[2px_2px_0px_0px_#1A1613] tracking-wide">
            {perfilAtivo}
          </div>

          <div className="bg-[#FAF7F0] border-2 border-[#1A1613] pl-3 pr-4 py-1.5 rounded-2xl font-black text-base shadow-[3px_3px_0px_0px_#1A1613] flex items-center gap-3 text-[#1A1613]">
            <img src={iconeCarteira} alt="Ícone de Carteira" />
            <div className="flex items-center gap-1">
              <span className="font-bold">{pontos}</span>
              <img className="w-6" src={iconePontoCaju} alt="Pontos Caju" />
            </div>
          </div>
        </div>

        {/* === CANVAS DO MAPA === */}
        <div
          className="flex-1 w-full bg-[#E5E0D8] relative z-10 cursor-pointer"
          onClick={() => {
            // Agora, ao invés de barraca, abre o primeiro lugar (CajuHub)
            const primeiroLugar = LUGARES_MOCK[0];
            if (primeiroLugar) handleAbrirLugar(primeiroLugar);
            // OU, para abrir uma barraca, seria:
            // const primeiraBarraca = barracas[0];
            // if (primeiraBarraca) handleAbrirBarraca(primeiraBarraca);
          }}
          title="Espaço reservado para o Canvas do Mapa"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-30 select-none pointer-events-none">
            <span className="text-4xl mb-2">🗺️</span>
            <p className="font-bold text-xs uppercase tracking-widest">
              Canvas do Mapa Interativo
            </p>
            <p className="text-[10px] mt-1 font-medium">
              Insira aqui o elemento do Leaflet.js / Mapbox
            </p>
          </div>
        </div>

        {/* === DRAWER DE DETALHES (genérico para Barraca ou Lugar) === */}
        {isMenuOpen && (barracaSelecionada || lugarSelecionado) && (
          <div
            className="absolute inset-0 bg-black/40 z-70 transition-opacity flex items-end justify-center"
            onClick={handleFecharDrawer}
          >
            <div
              className="w-full bg-white border-t-4 border-[#1A1613] rounded-t-[32px] p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] flex flex-col gap-5 animate-slide-up relative max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barra de arrastar */}
              <div
                className="w-16 h-1.5 bg-[#FFB800] rounded-full mx-auto cursor-pointer"
                onClick={handleFecharDrawer}
              />

              {/* Informações Principais (Barraca ou Lugar) */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3">
                  {/* Ícone Redondo ou Imagem para o Lugar */}
                  <div className="w-16 h-16 bg-[#FFB800] rounded-2xl border-2 border-[#1A1613] shadow-[2px_2px_0px_0px_#1A1613] flex items-center justify-center text-3xl overflow-hidden">
                    {lugarSelecionado?.imagemURL ? (
                      <img
                        src={lugarSelecionado.imagemURL}
                        alt={lugarSelecionado.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      barracaSelecionada?.icone
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-[#1A1613]">
                      {barracaSelecionada?.nome || lugarSelecionado?.nome}
                    </h3>
                    {barracaSelecionada && (
                      <p className="text-sm font-medium text-gray-500">
                        por {barracaSelecionada.responsavel}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleFecharDrawer}
                  className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Botões de Acessibilidade */}
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={handleTextToSpeech}
                  className={`col-span-3 h-12 border-2 border-[#1A1613] rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#1A1613] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-white
                    ${isPlayingAudio ? "bg-red-500" : "bg-[#0066CC]"}`}
                >
                  <span>{isPlayingAudio ? "⏹️" : "🔊"}</span>
                  <span>
                    {isPlayingAudio ? "Parar descrição" : "Ouvir descrição"}
                  </span>
                </button>

                <button
                  onClick={() => setIsHighContrast(!isHighContrast)}
                  className={`col-span-1 h-12 border-2 border-[#1A1613] rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#1A1613] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1 cursor-pointer
                    ${isHighContrast ? "bg-[#FFB800] text-[#1A1613]" : "bg-white text-[#1A1613]"}`}
                  title="Alternar Alto Contraste"
                >
                  <span className="text-xs">T</span>
                  <span className="text-sm font-black">A+</span>
                </button>
              </div>

              {/* Descrição */}
              <div className="bg-[#FAF7F0] border border-orange-200 rounded-2xl p-4 text-sm font-medium text-gray-800 leading-relaxed">
                {barracaSelecionada?.descricao || lugarSelecionado?.descricaoDetalhada || "Nenhuma descrição disponível."}
              </div>

              {/* === BOTÃO QR CODE PARA LUGARES === */}
              {lugarSelecionado && ( // Mostra este botão SOMENTE se for um Lugar
                <div className="flex justify-center mt-3">
                  <button
                    onClick={onOpenScanner}
                    className="w-64 h-12 bg-gradient-to-r from-[#C84B24] to-[#A33614] hover:from-[#A33614] hover:to-[#852A0E] text-white font-black text-sm rounded-full shadow-[2px_2px_0px_0px_#1A1613] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer tracking-wide"
                  >
                    <img src={iconeQr} alt="" className="w-5 h-5" />
                    Escanear QR do Local
                  </button>
                </div>
              )}

              {/* Cardápio (Apenas para Barracas) */}
              {barracaSelecionada && barracaSelecionada.cardapio.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-black text-base text-[#1A1613] tracking-tight">
                    Cardápio
                  </h4>
                  {barracaSelecionada.cardapio.map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#FAF7F0] border-2 border-gray-200 rounded-xl p-3 flex justify-between items-center"
                    >
                      <span className="font-bold text-sm text-gray-700">
                        {item.nome}
                      </span>
                      <span className="font-black text-sm text-[#E65C00]">
                        R$ {item.preco}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Botão de Check-in (Apenas para Barracas) */}
              {barracaSelecionada && (
                <button
                  onClick={handleCheckin}
                  disabled={jaFezCheckin}
                  className={`w-full h-14 font-black text-sm border-2 border-[#1A1613] rounded-2xl shadow-[4px_4px_0px_0px_#1A1613] transition-all flex items-center justify-center gap-2 mt-2
                    ${
                      jaFezCheckin
                        ? "bg-gray-200 text-gray-500 border-gray-400 shadow-none cursor-not-allowed"
                        : "bg-gradient-to-r from-[#FFA800] to-[#E65C00] text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                    }`}
                >
                  {jaFezCheckin ? (
                    <>
                      <span>✅</span> Check-in já realizado
                    </>
                  ) : (
                    <>
                      <span>🔲</span> Estou aqui / Consumi (+
                      {barracaSelecionada.pontosCheckin} pts)
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* === BOTÃO FLUTUANTE CENTRAL: ESCANEAR QR CODE PRINCIPAL === */}
        {/* Mantido no lugar para escanear QR de barracas quando o Drawer NÃO estiver aberto */}
        <div className="absolute bottom-30 left-0 right-0 mx-auto w-fit z-20 px-4">
          <button
            onClick={onOpenScanner}
            className="w-64 h-14 bg-gradient-to-r from-[#C84B24] to-[#A33614] hover:from-[#A33614] hover:to-[#852A0E] text-white font-black text-sm rounded-full shadow-[2px_2px_0px_0px_#1A1613] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer tracking-wide"
          >
            <img src={iconeQr} alt="" />
            <div className="text-left leading-tight">
              <p className="font-bold uppercase text-md tracking-wider opacity-80">
                Escanear QR
              </p>
              <p className="text-sm font-black">Code da Barraca</p>
            </div>
          </button>
        </div>

        {/* === BOTTOM NAV === */}
        <BottomNav active="mapa" onNavegar={onNavegar} />
      </div>
    </div>
  );
}