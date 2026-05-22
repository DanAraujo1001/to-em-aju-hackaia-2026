import balao from "../assets/images/balao.webp";
import bandeira1 from "../assets/images/bandeira-1.webp";
import bandeira2 from "../assets/images/bandeira-2.webp";
import rotaAcessivel from "../assets/images/rota-acessivel.webp";
import rotaConforto from "../assets/images/rota-conforto.webp";
import rotaExplorador from "../assets/images/rota-explorador.webp";
import Logo from "../components/Logo";

type ProfileType = "acessivel" | "conforto" | "explorador";

interface EscolhaCircuitoProps {
  onSelecionarPerfil: (_perfil: ProfileType) => void;
}

export default function EscolhaCircuito({
  onSelecionarPerfil,
}: EscolhaCircuitoProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFA800] via-[#E65C00] to-[#C84B24] flex justify-center items-center p-4 relative overflow-hidden selection:bg-[#C84B24] selection:text-white">
      {/* DECORAÇÃO LATERAL: BALÃO JUNINO NO CANTO DIREITO */}
      <div className="absolute -right-15 top-[20%] pointer-events-none drop-shadow-lg opacity-90 transform  flex flex-col items-center">
        <img className="w-50" src={balao} alt="Balão Junino" />
      </div>

      {/* DECORAÇÃO LATERAL: BANDEIRINHAS FLUTUANTES NO CANTO ESQUERDO */}
      <div className="absolute -left-8.75 top-[40%] flex flex-col gap-6 pointer-events-none opacity-85 transform ">
        <img className="w-25" src={bandeira1} alt="Bandeirinha" />
      </div>

      {/* DECORAÇÃO LATERAL: BANDEIRINHAS NO CANTO INFERIOR DIREITO */}
      <div className="absolute -right-7.5 bottom-[15%] flex flex-col gap-4 pointer-events-none opacity-85 transform">
        <img className="w-20 " src={bandeira2} alt="Bandeirinha" />
      </div>

      <div className="w-full max-w-md min-h-screen flex flex-col justify-center items-center px-6 relative py-6 z-10">
        <Logo className="w-54 mb-8" />

        <h2 className="text-2xl font-black text-white text-center mb-8 tracking-tight max-w-xs drop-shadow-md leading-tight">
          Escolha o melhor circuito para você
        </h2>

        {/* LISTA DE OPÇÕES DE CIRCUITO */}
        <div className="space-y-5 max-w-xs flex flex-col align-center">
          <button
            onClick={() => onSelecionarPerfil("acessivel")}
            className="bg-[#FFB800] border-2 border-[#1A1613] rounded-2xl p-4 shadow-[5px_5px_0px_0px_#1A1613] hover:bg-[#ffa700] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex flex-col items-center gap-3 cursor-pointer group"
          >
            <img className="w-35" src={rotaAcessivel} alt="Rota Acessível" />
            <span className="text-lg font-bold text-[#1A1613] tracking-tight group-hover:scale-102 transition-transform">
              Rota Acessível
            </span>
          </button>

          <button
            onClick={() => onSelecionarPerfil("conforto")}
            className="w-full bg-[#FFB800] border-2 border-[#1A1613] rounded-2xl p-4 shadow-[5px_5px_0px_0px_#1A1613] hover:bg-[#ffa700] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex flex-col items-center gap-3 cursor-pointer group"
          >
            <img className="w-35" src={rotaConforto} alt="Rota Conforto" />
            <span className="text-lg font-bold text-[#1A1613] tracking-tight group-hover:scale-102 transition-transform">
              Rota Conforto
            </span>
          </button>

          <button
            onClick={() => onSelecionarPerfil("explorador")}
            className="w-full bg-[#FFB800] border-2 border-[#1A1613] rounded-2xl p-4 shadow-[5px_5px_0px_0px_#1A1613] hover:bg-[#ffa700] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex flex-col items-center gap-3 cursor-pointer group"
          >
            <img className="w-35" src={rotaExplorador} alt="Rota Explorador" />
            <span className="text-lg font-bold text-[#1A1613] tracking-tight group-hover:scale-102 transition-transform">
              Rota Explorador
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
