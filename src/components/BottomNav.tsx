interface BottomNavProps {
  active: "mapa" | "passaporte";
  onNavegar: (_tela: "mapa" | "passaporte") => void;
}

export default function BottomNav({ active, onNavegar }: BottomNavProps) {
  return (
    <nav className="bg-white absolute bottom-0 inset-x-0 border-t-2 border-[#1A1613] z-30 flex px-4 py-3 items-center justify-around">
      <button
        onClick={() => onNavegar("mapa")}
        className={`flex flex-col items-center justify-center gap-1 px-6 py-1 ${active === "mapa" ? "bg-[#FFB800] text-[#1A1613] border-2 border-[#1A1613] rounded-xl shadow-[3px_3px_0px_0px_#1A1613] font-black text-md" : "bg-transparent text-gray-500 font-bold text-md"} transition-all cursor-pointer`}
      >
        <span>Mapa</span>
      </button>

      <button
        onClick={() => onNavegar("passaporte")}
        className={`flex flex-col items-center justify-center gap-1 px-6 py-1 ${active === "passaporte" ? "bg-[#FFB800] text-[#1A1613] border-2 border-[#1A1613] rounded-xl shadow-[3px_3px_0px_0px_#1A1613] font-black text-sm" : "bg-transparent text-gray-500 font-bold text-md"} transition-all cursor-pointer`}
      >
        <span>Meu Passaporte</span>
      </button>
    </nav>
  );
}
