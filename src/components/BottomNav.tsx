interface BottomNavProps {
  active: "mapa" | "passaporte";
  onNavegar: (tela: "mapa" | "passaporte" | "foto") => void; // Adicionamos 'foto' aqui
}

export default function BottomNav({ active, onNavegar }: BottomNavProps) {
  return (
    <div className="absolute bottom-0 w-full h-20 bg-white border-t-2 border-[#1A1613] rounded-t-3xl shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex justify-between items-center px-10 z-50">
      {/* Botão MAPA */}
      <button
        onClick={() => onNavegar("mapa")}
        className={`flex flex-col items-center justify-center gap-1 transition-opacity ${
          active === "mapa" ? "opacity-100" : "opacity-40 hover:opacity-70"
        }`}
      >
        <span className="text-2xl">🗺️</span>
        <span className="text-[10px] font-black uppercase tracking-wider text-[#1A1613]">
          Mapa
        </span>
      </button>

      {/* BOTÃO CENTRAL FLUTUANTE DA MOLDURA (NOVO) */}
      <button
        onClick={() => onNavegar("foto")}
        className="relative flex flex-col items-center justify-center bg-gradient-to-tr from-[#FFA800] to-[#E65C00] rounded-full w-16 h-16 -mt-10 border-4 border-[#FAF7F0] shadow-[0_4px_10px_rgba(0,0,0,0.3)] active:scale-95 transition-transform"
      >
        <span className="text-3xl">📸</span>
        {/* Balãozinho indicando que ganha pontos */}
        <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-sm rotate-12">
          +30 Pts
        </div>
      </button>

      {/* Botão PASSAPORTE */}
      <button
        onClick={() => onNavegar("passaporte")}
        className={`flex flex-col items-center justify-center gap-1 transition-opacity ${
          active === "passaporte"
            ? "opacity-100"
            : "opacity-40 hover:opacity-70"
        }`}
      >
        <span className="text-2xl">🎟️</span>
        <span className="text-[10px] font-black uppercase tracking-wider text-[#1A1613]">
          Álbum
        </span>
      </button>
    </div>
  );
}
