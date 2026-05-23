// src/pages/Cadastro.tsx
import { useState } from "react";
import Logo from "../components/Logo";
import { type Usuario } from "../mocks/usuario"; // <-- Importa o tipo Usuario

interface CadastroProps {
  onConfirmar: (_dados: Usuario) => void;
}

export default function Cadastro({ onConfirmar }: CadastroProps) {
  const [form, setForm] = useState<Usuario>({
    // <-- Usa Usuario como tipo do estado do formulário
    nome: "",
    cpf: "",
    origem: "",
  });

  // eslint-disable-next-line no-undef
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Adiciona validação básica para CPF
    if (form.nome && form.cpf && form.origem) {
      // <-- Inclui CPF na validação
      onConfirmar(form);
    } else {
      alert(
        "Por favor, preencha todos os campos obrigatórios: Nome, CPF e De onde é.",
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFA800] via-[#E65C00] to-[#C84B24] flex justify-center items-center p-4 selection:bg-[#C84B24] selection:text-white">
      <div className="w-full max-w-md min-h-screen flex flex-col justify-center items-center px-6 relative py-8">
        <Logo className="w-56 mb-8" />

        <div className="text-center text-white mb-6 space-y-1">
          <h2 className="text-3xl font-black tracking-tight drop-shadow-md">
            Cadastre-se no evento
          </h2>
          <p className="text-sm font-medium opacity-90 drop-shadow-sm">
            Preencha os dados para participar
          </p>
        </div>

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

          {/* CAMPO: CPF */}
          <div className="space-y-2">
            <label
              htmlFor="cpf"
              className="block text-sm font-black text-[#1A1613]"
            >
              CPF
            </label>
            <input
              type="text" // Pode ser 'tel' para mobilidade no teclado numérico
              id="cpf"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
              className="w-full h-12 px-4 bg-[#FAF7F0] border-2 border-[#1A1613] rounded-xl font-medium text-[#1A1613] placeholder-gray-400 focus:outline-none shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)]"
              required
              maxLength={14} // Limita o comprimento para CPF formatado
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
