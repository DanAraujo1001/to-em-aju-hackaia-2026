import "./App.css";
import { useState, useEffect } from "react";
import EscolhaCircuito from "./pages/EscolhaCircuito";
import Home from "./pages/Home";
import MeuPassaporte from "./pages/MeuPassaporte";
import ResgatePremio from "./pages/ResgatePremio";
import ScannerQRCode from "./pages/ScannerQRCode";
import Cadastro from "./pages/Cadastro";
import InstallBanner from "./components/InstallBanner";
import FotoMoldura from "./pages/FotoMoldura";
import { useAppStore } from "./store/useAppStore";

type Screen =
  | "cadastro"
  | "escolha"
  | "home"
  | "passaporte"
  | "resgate"
  | "scanner"
  | "foto"; // ATUALIZADO: Adiciona 'foto'

function App() {
  const store = useAppStore();

  const [screen, setScreen] = useState<Screen>(() => {
    // Prioriza o cadastro se não estiver completo, senão vai para home
    if (!store.cadastroCompleto) return "cadastro";
    return "home";
  });

  // State para guardar o ID do prêmio selecionado antes de ir para a tela de resgate
  const [premioSelecionadoId, setPremioSelecionadoId] = useState<number | null>(
    null,
  );

  // Efeito para sincronizar a tela inicial se o cadastro for concluído externamente
  useEffect(() => {
    if (store.cadastroCompleto && screen === "cadastro") {
      setScreen("escolha");
    }
  }, [store.cadastroCompleto, screen]);

  // Busca os dados do prêmio selecionado a partir do ID
  const premioSelecionado =
    store.recompensas.find((r) => r.id === premioSelecionadoId) ?? null;

  // Função centralizada para controlar a navegação do Menu Inferior (Victor-Branch, adaptada para useAppStore)
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
    // Usa React.Fragment para agrupar, mas mantendo a div e o botão secreto da Victor-Branch no layout
    <div className="relative min-h-screen">
      {screen === "cadastro" && (
        <Cadastro
          onConfirmar={(dados) => {
            store.confirmarCadastro(dados);
            setScreen("escolha");
          }}
        />
      )}

      {screen === "escolha" && (
        <EscolhaCircuito
          onSelecionarPerfil={(p) => {
            store.selecionarPerfil(p);
            setScreen("home");
          }}
        />
      )}

      {screen === "home" && (
        <>
          <Home
            pontos={store.pontos}
            perfilAtivo={store.perfilLabel}
            barracas={store.barracas}
            checkins={store.checkins}
            onNavegar={lidarComNavegacaoInferior}
            onOpenScanner={() => setScreen("scanner")}
            onFazerCheckin={(barracaId) => store.fazerCheckin(barracaId)}
          />
          <InstallBanner />
        </>
      )}

      {screen === "passaporte" && (
        <MeuPassaporte
          pontos={store.pontos}
          figurinhas={store.figurinhas}
          recompensas={store.recompensas}
          premiosResgatados={store.premiosResgatados}
          proximoPremio={store.proximoPremio}
          progressoProximoPremio={store.progressoProximoPremio}
          totalFigurinhasCarimbadas={store.totalFigurinhasCarimbadas}
          onNavegar={lidarComNavegacaoInferior}
          onResgatarPremio={(id) => {
            store.resgatarPremio(id); // Registra que o prêmio foi resgatado no store
            setPremioSelecionadoId(id); // Armazena o ID para a tela de resgate
            setScreen("resgate");
          }}
          onVoltar={() => setScreen("home")}
        />
      )}

      {screen === "foto" && (
        <FotoMoldura
          onVoltar={() => setScreen("home")}
          onCompartilhar={(pontosGanhos) => {
            store.adicionarPontosDummy(pontosGanhos); // Adiciona pontos via store
            setScreen("passaporte");
          }}
        />
      )}

      {screen === "resgate" && (
        <ResgatePremio
          premio={premioSelecionado} // Passa o objeto do prêmio, não apenas o custo
          onVoltar={() => setScreen("passaporte")}
          // A lógica de consumir pontos já está em store.resgatarPremio.
          // Aqui, onConfirmarResgate pode ser um evento para "marcar como entregue".
          onConfirmarResgate={() => { /* Poderia chamar uma API ou marcar como entregue */ }}
        />
      )}

      {screen === "scanner" && (
        <ScannerQRCode
          onFechar={() => setScreen("home")}
          onSucessoScan={(barracaId) => {
            // A lógica de fazerCheckin já está no store
            store.fazerCheckin(barracaId);
            setScreen("passaporte");
          }}
        />
      )}

      {/* BOTÃO SECRETO DE PITCH - PARA TESTES */}
      {(screen === "home" || screen === "passaporte" || screen === "escolha") && ( // Adicionado escolha para ver o botão mais cedo
        <button
          onClick={() => store.adicionarPontosDummy(50)} // Adiciona pontos via store
          className="fixed bottom-24 right-4 bg-green-500 text-white font-black px-4 py-3 rounded-full shadow-[4px_4px_0px_0px_#1A1613] border-2 border-[#1A1613] z-50 hover:bg-green-600 active:translate-y-1 active:shadow-none text-xs"
        >
          ⚡ +50 Pts (Teste)
        </button>
      )}
    </div>
  );
}

export default App;