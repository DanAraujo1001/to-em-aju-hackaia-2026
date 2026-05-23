// src/store/useAppStore.ts
import { useState, useEffect, useCallback } from "react";
import { FIGURINHAS_MOCK, type Figurinha } from "../mocks/figurinhas";
import { RECOMPENSAS_MOCK, type Recompensa } from "../mocks/recompensas";
import { BARRACAS_MOCK, type Barraca } from "../mocks/barracas";
import { type Usuario, USUARIO_INICIAL } from "../mocks/usuario"; // <-- Usuário atualizado

// Chaves do localStorage
const STORAGE_KEYS = {
  PONTOS: "circuito_caju:pontos",
  PERFIL: "circuito_caju:perfil",
  FIGURINHAS: "circuito_caju:figurinhas",
  PREMIOS_RESGATADOS: "circuito_caju:premios_resgatados",
  CHECKINS: "circuito_caju:checkins",
  FEEDBACKS: "circuito_caju:feedbacks",
  USUARIO: "circuito_caju:usuario",
  CADASTRO_COMPLETO: "circuito_caju:cadastro_completo",
} as const;

// Helper genérico para ler do localStorage com fallback
function lerStorage<T>(chave: string, fallback: T): T {
  try {
    const item = localStorage.getItem(chave);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Helper genérico para salvar no localStorage
function salvarStorage<T>(chave: string, valor: T): void {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    console.warn(`Erro ao salvar ${chave} no localStorage`);
  }
}

export type PerfilType = "acessivel" | "conforto" | "explorador";

export interface FeedbackResposta {
  perguntaId: string;
  perguntaTexto: string;
  respostaId: string;
  respostaTexto: string;
}

export interface FeedbackRegistro {
  id: string;
  barracaId: number;
  barracaNome: string;
  conjuntoId: string;
  respostas: FeedbackResposta[];
  comentario: string;
  pontosBonus: number;
  criadoEm: string;
}

export interface AppState {
  // Dados do usuário
  usuario: Usuario;
  cadastroCompleto: boolean;

  // Progresso do jogo
  pontos: number;
  perfil: PerfilType;
  figurinhas: Figurinha[];
  premiosResgatados: number[];
  checkins: number[]; // IDs das barracas já visitadas
  feedbacks: FeedbackRegistro[];

  // Dados estáticos (mocks)
  recompensas: Recompensa[];
  barracas: Barraca[];

  // Ações
  confirmarCadastro: (_usuario: Usuario) => void;
  selecionarPerfil: (_perfil: PerfilType) => void;
  fazerCheckin: (_barracaId: number) => void;
  registrarFeedback: (
    _feedback: Omit<FeedbackRegistro, "id" | "pontosBonus" | "criadoEm"> & {
      pontosBonus?: number;
    },
  ) => void;
  resgatarPremio: (_premioId: number) => void;
  resetarProgresso: () => void;

  // Computed
  perfilLabel: string;
  proximoPremio: Recompensa | null;
  progressoProximoPremio: number;
  totalFigurinhasCarimbadas: number;
}

export function useAppStore(): AppState {
  // --- Estado persistido ---
  const [usuario, setUsuario] = useState<Usuario>(() =>
    lerStorage(STORAGE_KEYS.USUARIO, USUARIO_INICIAL),
  );

  const [cadastroCompleto, setCadastroCompleto] = useState<boolean>(() =>
    lerStorage(STORAGE_KEYS.CADASTRO_COMPLETO, false),
  );

  const [pontos, setPontos] = useState<number>(() =>
    lerStorage(STORAGE_KEYS.PONTOS, 0),
  );

  const [perfil, setPerfil] = useState<PerfilType>(() =>
    lerStorage(STORAGE_KEYS.PERFIL, "acessivel"),
  );

  const [figurinhas, setFigurinhas] = useState<Figurinha[]>(() =>
    lerStorage(STORAGE_KEYS.FIGURINHAS, FIGURINHAS_MOCK),
  );

  const [premiosResgatados, setPremiosResgatados] = useState<number[]>(() =>
    lerStorage(STORAGE_KEYS.PREMIOS_RESGATADOS, []),
  );

  const [checkins, setCheckins] = useState<number[]>(() =>
    lerStorage(STORAGE_KEYS.CHECKINS, []),
  );

  const [feedbacks, setFeedbacks] = useState<FeedbackRegistro[]>(() =>
    lerStorage(STORAGE_KEYS.FEEDBACKS, []),
  );

  // --- Sincroniza com localStorage sempre que o estado muda ---
  useEffect(() => {
    salvarStorage(STORAGE_KEYS.USUARIO, usuario);
  }, [usuario]);

  useEffect(() => {
    salvarStorage(STORAGE_KEYS.CADASTRO_COMPLETO, cadastroCompleto);
  }, [cadastroCompleto]);

  useEffect(() => {
    salvarStorage(STORAGE_KEYS.PONTOS, pontos);
  }, [pontos]);

  useEffect(() => {
    salvarStorage(STORAGE_KEYS.PERFIL, perfil);
  }, [perfil]);

  useEffect(() => {
    salvarStorage(STORAGE_KEYS.FIGURINHAS, figurinhas);
  }, [figurinhas]);

  useEffect(() => {
    salvarStorage(STORAGE_KEYS.PREMIOS_RESGATADOS, premiosResgatados);
  }, [premiosResgatados]);

  useEffect(() => {
    salvarStorage(STORAGE_KEYS.CHECKINS, checkins);
  }, [checkins]);

  useEffect(() => {
    salvarStorage(STORAGE_KEYS.FEEDBACKS, feedbacks);
  }, [feedbacks]);

  // --- Ações ---
  const confirmarCadastro = useCallback((dados: Usuario) => {
    setUsuario(dados);
    setCadastroCompleto(true);
  }, []);

  const selecionarPerfil = useCallback((novoPerfil: PerfilType) => {
    setPerfil(novoPerfil);
  }, []);

  const fazerCheckin = useCallback(
    (barracaId: number) => {
      // Evita checkin duplicado
      if (checkins.includes(barracaId)) return;

      const barraca = BARRACAS_MOCK.find((b) => b.id === barracaId);
      if (!barraca) return;

      // Adiciona pontos
      setPontos((prev) => prev + barraca.pontosCheckin);

      // Registra o checkin
      setCheckins((prev) => [...prev, barracaId]);

      // Carimba a figurinha correspondente
      setFigurinhas((prev) =>
        prev.map((fig) =>
          fig.id === barraca.figurinhaId ? { ...fig, carimbado: true } : fig,
        ),
      );
    },
    [checkins],
  );

  const registrarFeedback = useCallback(
    (
      feedback: Omit<FeedbackRegistro, "id" | "pontosBonus" | "criadoEm"> & {
        pontosBonus?: number;
      },
    ) => {
      const pontosBonus = feedback.pontosBonus ?? 20;
      const novoFeedback: FeedbackRegistro = {
        ...feedback,
        id: globalThis.crypto?.randomUUID?.() ?? `feedback-${Date.now()}`,
        pontosBonus,
        criadoEm: new Date().toISOString(),
      };

      setFeedbacks((prev) => [...prev, novoFeedback]);
      setPontos((prev) => prev + pontosBonus);
    },
    [],
  );

  const resgatarPremio = useCallback(
    (premioId: number) => {
      const premio = RECOMPENSAS_MOCK.find((r) => r.id === premioId);
      if (!premio) return;
      if (pontos < premio.pontosNecessarios) return;
      if (premiosResgatados.includes(premioId)) return;

      setPremiosResgatados((prev) => [...prev, premioId]);
    },
    [pontos, premiosResgatados],
  );

  const resetarProgresso = useCallback(() => {
    setPontos(0);
    setFigurinhas(FIGURINHAS_MOCK);
    setPremiosResgatados([]);
    setCheckins([]);
    setFeedbacks([]);
  }, []);

  // --- Computed values ---
  const perfilLabel =
    perfil === "acessivel"
      ? "Rota Acessível"
      : perfil === "conforto"
        ? "Rota Conforto"
        : "Rota Explorador";

  const proximoPremio =
    RECOMPENSAS_MOCK.find(
      (r) => !premiosResgatados.includes(r.id) && pontos < r.pontosNecessarios,
    ) ?? null;

  const progressoProximoPremio = proximoPremio
    ? Math.min((pontos / proximoPremio.pontosNecessarios) * 100, 100)
    : 100;

  const totalFigurinhasCarimbadas = figurinhas.filter(
    (f) => f.carimbado,
  ).length;

  return {
    // Estado
    usuario,
    cadastroCompleto,
    pontos,
    perfil,
    figurinhas,
    premiosResgatados,
    checkins,
    feedbacks,

    // Dados estáticos
    recompensas: RECOMPENSAS_MOCK,
    barracas: BARRACAS_MOCK,

    // Ações
    confirmarCadastro,
    selecionarPerfil,
    fazerCheckin,
    registrarFeedback,
    resgatarPremio,
    resetarProgresso,

    // Computed
    perfilLabel,
    proximoPremio,
    progressoProximoPremio,
    totalFigurinhasCarimbadas,
  };
}
