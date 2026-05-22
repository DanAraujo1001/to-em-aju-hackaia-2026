import React, { useState } from "react";
import Logo from "../components/Logo";

interface CadastroForm {
  nome: string;
  origem: string;
  comoConheceu: string;
}

interface CadastroProps {
  onConfirmar: (_dados: CadastroForm) => void;
}

export default function Cadastro({ onConfirmar }: CadastroProps) {
  const [form, setForm] = useState<CadastroForm>({
    nome: "",
    origem: "",
    comoConheceu: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nome && form.origem) {
      onConfirmar(form);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFA800] via-[#E65C00] to-[#C84B24] flex justify-center items-center p-4 selection:bg-[#C84B24] selection:text-white">
      {/* Container de simulação Mobile PWA */}
      <div className="w-full max-w-md min-h-screen flex flex-col justify-center items-center px-6 relative py-8">
        {/* LOGO CIRCUITO CAJU */}
        <Logo className="w-56 mb-8" />

        {/* CHAMADA TEXTUAL */}
        <div className="text-center text-white mb-6 space-y-1">
          <h2 className="text-3xl font-black tracking-tight drop-shadow-md">
            Cadastre-se no evento
          </h2>
          <p className="text-sm font-medium opacity-90 drop-shadow-sm">
            Preencha os dados para participar
          </p>
        </div>

        {/* CARD DO FORMULÁRIO (NEO-BRUTALISTA) */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-[#FFB800] border-2 border-[#1A1613] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1A1613] space-y-5"
        >
          {/* CAMPO: NOME */}
          <div className="space-y-2">
            <label
              htmlFor="nome"
              className="block text-sm font-black text-[#1A1613]"
            >
              Nome
            </label>
            <input
              type="text"
              id="nome"
              placeholder="Seu nome completo"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full h-12 px-4 bg-[#FAF7F0] border-2 border-[#1A1613] rounded-xl font-medium text-[#1A1613] placeholder-gray-400 focus:outline-none shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)]"
              required
            />
          </div>

          {/* CAMPO: DE ONDE É? */}
          <div className="space-y-2">
            <label
              htmlFor="origem"
              className="block text-sm font-black text-[#1A1613]"
            >
              De onde é?
            </label>
            <input
              type="text"
              id="origem"
              placeholder="Cidade, Estado"
              value={form.origem}
              onChange={(e) => setForm({ ...form, origem: e.target.value })}
              className="w-full h-12 px-4 bg-[#FAF7F0] border-2 border-[#1A1613] rounded-xl font-medium text-[#1A1613] placeholder-gray-400 focus:outline-none shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)]"
              required
            />
          </div>

          {/* CAMPO: COMO FICOU CONHECENDO? */}
          <div className="space-y-2">
            <label
              htmlFor="comoConheceu"
              className="block text-sm font-black text-[#1A1613]"
            >
              Como ficou conhecendo o evento?
            </label>
            <div className="relative">
              <select
                id="comoConheceu"
                value={form.comoConheceu}
                onChange={(e) =>
                  setForm({ ...form, comoConheceu: e.target.value })
                }
                className="w-full h-12 px-4 bg-[#FAF7F0] border-2 border-[#1A1613] rounded-xl font-medium text-[#1A1613] appearance-none focus:outline-none cursor-pointer"
              >
                <option value="" disabled hidden></option>
                <option value="redes-sociais">Redes Sociais</option>
                <option value="tv-radio">TV / Rádio</option>
                <option value="amigos">Amigos / Família</option>
                <option value="sites">Sites de Turismo</option>
                <option value="outros">Outros</option>
              </select>
              {/* Seta customizada do select */}
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#1A1613]">
                <svg
                  className="w-4 h-4 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* BOTÃO SUBMIT */}
          <button
            type="submit"
            className="w-full h-14 mt-2 bg-[#C84B24] hover:bg-[#b03f1d] text-white font-black text-base border-2 border-[#1A1613] rounded-xl shadow-[4px_4px_0px_0px_#1A1613] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Confirmar inscrição <span>➔</span>
          </button>
        </form>
      </div>
    </div>
  );
}
