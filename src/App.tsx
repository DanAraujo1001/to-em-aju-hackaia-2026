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

  return (
    <>
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
          pontos={120}
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
          pontos={120}
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
    </>
  );
}

export default App;
