import "./App.css";
import React, { useState } from "react";
import EscolhaCircuito from "./pages/EscolhaCircuito";
import Home from "./pages/Home";
import MeuPassaporte from "./pages/MeuPassaporte";
import ResgatePremio from "./pages/ResgatePremio";
import ScannerQRCode from "./pages/ScannerQRCode";
import Cadastro from "./pages/Cadastro";
import FotoMoldura from "./pages/FotoMoldura"; // IMPORTAMOS A NOVA TELA AQUI

type Screen =
  | "escolha"
  | "home"
  | "passaporte"
  | "resgate"
  | "scanner"
  | "cadastro"
  | "foto";

function App() {
  const [screen, setScreen] = useState<Screen>("escolha");
  const [perfil, setPerfil] = useState<"acessivel" | "conforto" | "explorador">(
    "acessivel",
  );

  const [pontos, setPontos] = useState(() => {
    return Number(localStorage.getItem("caju_pontos") || "120");
  });

  const adicionarPontos = (quantidade: number) => {
    const novosPontos = pontos + quantidade;
    localStorage.setItem("caju_pontos", novosPontos.toString());
    setPontos(novosPontos);
    alert(`Sucesso! Você ganhou +${quantidade} Pontos Caju!`);
  };

  const gastarPontos = (quantidade: number) => {
    if (pontos >= quantidade) {
      const novosPontos = pontos - quantidade;
      localStorage.setItem("caju_pontos", novosPontos.toString());
      setPontos(novosPontos);
      return true;
    }
    return false;
  };

  // Função centralizada para controlar a navegação do Menu Inferior
  const lidarComNavegacaoInferior = (tela: "mapa" | "passaporte" | "foto") => {
    if (tela === "foto") {
      setScreen("foto");
    } else if (tela === "mapa") {
      setScreen("home");
    } else {
      setScreen("passaporte");
    }
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
          pontos={pontos}
          perfilAtivo={
            perfil === "acessivel"
              ? "Rota Acessível"
              : perfil === "conforto"
                ? "Rota Conforto"
                : "Rota Explorador"
          }
          onNavegar={lidarComNavegacaoInferior} // Usa a nova lógica de navegação
          onOpenScanner={() => setScreen("scanner")}
          onSelectBarracaPlaceholder={() => {}}
        />
      )}

      {screen === "passaporte" && (
        <MeuPassaporte
          pontos={pontos}
          onNavegar={lidarComNavegacaoInferior} // Usa a nova lógica de navegação
          onResgatarPremio={(_id) => {
            setScreen("resgate");
          }}
          onVoltar={() => setScreen("home")}
        />
      )}

      {/* NOVA TELA DE MOLDURA */}
      {screen === "foto" && (
        <FotoMoldura
          onVoltar={() => setScreen("home")}
          onCompartilhar={(pontosGanhos) => {
            // Ao compartilhar, ganha os pontos e vai direto ver eles caindo no Passaporte!
            adicionarPontos(pontosGanhos);
            setScreen("passaporte");
          }}
        />
      )}

      {screen === "resgate" && (
        <ResgatePremio
          pontosDisponiveis={pontos}
          onVoltar={() => setScreen("passaporte")}
          onConfirmarResgate={(custo) => {
            const sucesso = gastarPontos(custo);
            if (sucesso) {
              alert("Brinde retirado com sucesso! Os pontos foram deduzidos.");
              setScreen("passaporte");
            } else {
              alert("Ops! Você não tem pontos suficientes para este prêmio.");
            }
          }}
        />
      )}

      {screen === "scanner" && (
        <ScannerQRCode
          onFechar={() => setScreen("home")}
          onSucessoScan={() => {
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

      {/* BOTÃO SECRETO DE PITCH */}
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
