// src/App.tsx
import "./App.css";
import { useState, useEffect } from "react";
import EscolhaCircuito from "./pages/EscolhaCircuito";
import Home from "./pages/Home";
import MeuPassaporte from "./pages/MeuPassaporte";
import ResgatePremio from "./pages/ResgatePremio";
import ScannerQRCode from "./pages/ScannerQRCode";
import Feedback, { type FeedbackQuestionario } from "./pages/Feedback.tsx"; // Importa Feedback e seu tipo
import Cadastro from "./pages/Cadastro";
import InstallBanner from "./components/InstallBanner";
import FotoMoldura from "./pages/FotoMoldura"; // Importa FotoMoldura
import { useAppStore } from "./store/useAppStore";

type Screen =
  | "cadastro"
  | "escolha"
  | "home"
  | "passaporte"
  | "resgate"
  | "scanner"
  | "foto"      // Inclui 'foto'
  | "feedback"; // Inclui 'feedback'

function App() {
  const store = useAppStore();

  const [screen, setScreen] = useState<Screen>(() => {
    // Prioriza o cadastro se não estiver completo, senão vai para home
    if (!store.cadastroCompleto) return "cadastro";
    return "home";
  });

  const [premioSelecionadoId, setPremioSelecionadoId] = useState<number | null>(
    null,
  );

  const [feedbackBarracaId, setFeedbackBarracaId] = useState<number | null>( // State para o feedback
    null,
  );

  useEffect(() => {
    // Sincroniza a tela inicial se o cadastro for concluído externamente
    if (store.cadastroCompleto && screen === "cadastro") {
      setScreen("escolha");
    }
  }, [store.cadastroCompleto, screen]);

  const premioSelecionado =
    store.recompensas.find((r) => r.id === premioSelecionadoId) ?? null;

  const barracaFeedbackSelecionada = // Variável para a barraca selecionada para feedback
    store.barracas.find((b) => b.id === feedbackBarracaId) ?? null;

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
            setPremioSelecionadoId(id); // Armazena ID para tela de resgate
            setScreen("resgate");
          }}
          onVoltar={() => setScreen("home")}
        />
      )}

      {screen === "foto" && ( // Tela FotoMoldura
        <FotoMoldura
          onVoltar={() => setScreen("home")}
          onCompartilhar={(pontosGanhos) => {
            store.adicionarPontosDummy(pontosGanhos);
            setScreen("passaporte");
          }}
        />
      )}

      {screen === "resgate" && (
        <ResgatePremio
          premio={premioSelecionado}
          onVoltar={() => setScreen("passaporte")}
          onConfirmarResgate={() => {
            // Se o prêmio foi selecionado e tem pontos, resgata no store
            if (premioSelecionado) {
              store.resgatarPremio(premioSelecionado.id);
            }
          }}
        />
      )}

      {screen === "feedback" && barracaFeedbackSelecionada && ( // Tela Feedback
        <Feedback
          barraca={barracaFeedbackSelecionada}
          pontosAtuais={store.pontos}
          onFinalizar={() => {
            setFeedbackBarracaId(null); // Limpa o ID da barraca do feedback
            setScreen("passaporte"); // Volta para o passaporte
          }}
          onRegistrarFeedback={(feedback: FeedbackQuestionario) =>
            store.registrarFeedback({
              barracaId: barracaFeedbackSelecionada.id,
              barracaNome: barracaFeedbackSelecionada.nome,
              conjuntoId: feedback.conjuntoId,
              respostas: feedback.respostas,
              comentario: feedback.comentario,
            })
          }
        />
      )}

      {screen === "scanner" && (
        <ScannerQRCode
          onFechar={() => setScreen("home")}
          onSucessoScan={(barracaId) => { // O ScannerQRCode envia o ID da barraca
            const barraca = store.barracas.find((b) => b.id === barracaId);
            // Verifica se a barraca existe e se o check-in não foi feito
            if (barraca && !store.checkins.includes(barracaId)) {
              store.fazerCheckin(barracaId); // Processa o check-in (adiciona pontos e carimba figurinha)
              setFeedbackBarracaId(barracaId); // Define a barraca para o feedback
              setScreen("feedback"); // Vai para a tela de feedback
            } else {
              // Se a barraca já foi checada ou o ID é inválido, vai direto para o passaporte
              setScreen("passaporte");
            }
          }}
        />
      )}

      {/* BOTÃO SECRETO DE PITCH - PARA TESTES */}
      {(screen === "home" || screen === "passaporte" || screen === "escolha" || screen === "foto" || screen === "feedback") && (
        <button
          onClick={() => store.adicionarPontosDummy(50)}
          className="fixed bottom-24 right-4 bg-green-500 text-white font-black px-4 py-3 rounded-full shadow-[4px_4px_0px_0px_#1A1613] border-2 border-[#1A1613] z-50 hover:bg-green-600 active:translate-y-1 active:shadow-none text-xs"
        >
          ⚡ +50 Pts (Teste)
        </button>
      )}
    </div>
  );
}

export default App;