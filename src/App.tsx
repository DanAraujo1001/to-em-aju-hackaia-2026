import "./App.css";
import { useState, useEffect } from "react";
import EscolhaCircuito from "./pages/EscolhaCircuito";
import Home from "./pages/Home";
import MeuPassaporte from "./pages/MeuPassaporte";
import ResgatePremio from "./pages/ResgatePremio";
import ScannerQRCode from "./pages/ScannerQRCode";
import Feedback, { type FeedbackQuestionario } from "./pages/Feedback.tsx";
import Cadastro from "./pages/Cadastro";
import InstallBanner from "./components/InstallBanner";
import { useAppStore } from "./store/useAppStore";

type Screen =
  | "cadastro"
  | "escolha"
  | "home"
  | "passaporte"
  | "resgate"
  | "scanner"
  | "feedback";

function App() {
  const store = useAppStore();

  const [screen, setScreen] = useState<Screen>(() => {
    if (!store.cadastroCompleto) return "cadastro";
    return "home";
  });

  const [premioSelecionadoId, setPremioSelecionadoId] = useState<number | null>(
    null,
  );

  const [feedbackBarracaId, setFeedbackBarracaId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (store.cadastroCompleto && screen === "cadastro") {
      setScreen("escolha");
    }
  }, [store.cadastroCompleto, screen]);

  const premioSelecionado =
    store.recompensas.find((r) => r.id === premioSelecionadoId) ?? null;

  const barracaFeedbackSelecionada =
    store.barracas.find((b) => b.id === feedbackBarracaId) ?? null;

  return (
    <>
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
            onNavegar={(tela) =>
              setScreen(tela === "mapa" ? "home" : "passaporte")
            }
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
          onNavegar={(tela) =>
            setScreen(tela === "mapa" ? "home" : "passaporte")
          }
          onResgatarPremio={(id) => {
            store.resgatarPremio(id);
            setPremioSelecionadoId(id);
            setScreen("resgate");
          }}
          onVoltar={() => setScreen("home")}
        />
      )}

      {screen === "resgate" && (
        <ResgatePremio
          premio={premioSelecionado}
          onVoltar={() => setScreen("passaporte")}
        />
      )}

      {screen === "feedback" && barracaFeedbackSelecionada && (
        <Feedback
          barraca={barracaFeedbackSelecionada}
          pontosAtuais={store.pontos}
          onFinalizar={() => {
            setFeedbackBarracaId(null);
            setScreen("passaporte");
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
          onSucessoScan={() => {
            const barracaNaoVisitada = store.barracas.find(
              (b) => !store.checkins.includes(b.id),
            );
            if (barracaNaoVisitada) {
              store.fazerCheckin(barracaNaoVisitada.id);
              setFeedbackBarracaId(barracaNaoVisitada.id);
              setScreen("feedback");
              return;
            }
            setScreen("passaporte");
          }}
        />
      )}
    </>
  );
}

export default App;
