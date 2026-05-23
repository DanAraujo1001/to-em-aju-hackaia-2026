import "./App.css";
import React, { useState } from "react";
import EscolhaCircuito from "./pages/EscolhaCircuito";
import Home from "./pages/Home";
import MeuPassaporte from "./pages/MeuPassaporte";
import ResgatePremio from "./pages/ResgatePremio";
import ScannerQRCode from "./pages/ScannerQRCode";
import Cadastro from "./pages/Cadastro";

type Screen =
  | "escolha"
  | "home"
  | "passaporte"
  | "resgate"
  | "scanner"
  | "cadastro";

function App() {
  const [screen, setScreen] = useState<Screen>("escolha");
  const [perfil, setPerfil] = useState<"acessivel" | "conforto" | "explorador">(
    "acessivel",
  );

  // 1. ESTADO OFICIAL DOS PONTOS (Lê do offline ou começa com 120 para o Mockup)
  const [pontos, setPontos] = useState(() => {
    return Number(localStorage.getItem("caju_pontos") || "120");
  });

  // 2. FUNÇÃO QUE ATUALIZA PONTOS (Na tela e no offline)
  const adicionarPontos = (quantidade: number) => {
    const novosPontos = pontos + quantidade;
    localStorage.setItem("caju_pontos", novosPontos.toString());
    setPontos(novosPontos);
    alert(`Sucesso! Você ganhou +${quantidade} Pontos Caju!`);
  };

  return (
    <div className="relative min-h-screen">
      {screen === "escolha" && (
        <EscolhaCircuito
          onSelecionarPerfil={(p) => {
            setPerfil(p);
            setScreen("home");
          }}
        />
      )}

      {screen === "home" && (
        <Home
          pontos={pontos} // Agora é dinâmico!
          perfilAtivo={
            perfil === "acessivel"
              ? "Rota Acessível"
              : perfil === "conforto"
                ? "Rota Conforto"
                : "Rota Explorador"
          }
          onNavegar={(tela) =>
            setScreen(tela === "mapa" ? "home" : "passaporte")
          }
          onOpenScanner={() => setScreen("scanner")}
          onSelectBarracaPlaceholder={() => {}}
        />
      )}

      {screen === "passaporte" && (
        <MeuPassaporte
          pontos={pontos} // Agora é dinâmico!
          onNavegar={(tela) =>
            setScreen(tela === "mapa" ? "home" : "passaporte")
          }
          onResgatarPremio={(_id) => {
            setScreen("resgate");
          }}
          onVoltar={() => setScreen("home")}
        />
      )}

      {screen === "resgate" && (
        <ResgatePremio onVoltar={() => setScreen("passaporte")} />
      )}

      {screen === "scanner" && (
        <ScannerQRCode
          onFechar={() => setScreen("home")}
          onSucessoScan={() => {
            // Quando a câmera lê o QR Code real com sucesso
            adicionarPontos(50);
            setScreen("passaporte");
          }}
        />
      )}

      {screen === "cadastro" && (
        <Cadastro
          onConfirmar={(dados) => {
            alert(`Inscrição confirmada: ${dados.nome}`);
            setScreen("home");
          }}
        />
      )}

      {/* BOTÃO SECRETO DE PITCH (Aparece apenas na Home ou Passaporte) */}
      {(screen === "home" || screen === "passaporte") && (
        <button
          onClick={() => adicionarPontos(50)}
          className="fixed bottom-24 right-4 bg-green-500 text-white font-black px-4 py-3 rounded-full shadow-[4px_4px_0px_0px_#1A1613] border-2 border-[#1A1613] z-50 hover:bg-green-600 active:translate-y-1 active:shadow-none text-xs"
        >
          ⚡ +50 Pts (Teste)
        </button>
      )}
    </div>
  );
}

export default App;
