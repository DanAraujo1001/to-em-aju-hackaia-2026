import { useEffect, useState } from "react";
import type { Barraca } from "../mocks/barracas";
import questionarios from "../data/feedback-questionarios.json";
import type { FeedbackResposta } from "../store/useAppStore";

type OpcaoFeedback = {
  id: string;
  texto: string;
};

type PerguntaFeedback = {
  id: string;
  texto: string;
  opcoes: OpcaoFeedback[];
};

type ConjuntoFeedback = {
  id: string;
  titulo: string;
  perguntas: PerguntaFeedback[];
};

export type FeedbackQuestionario = {
  conjuntoId: string;
  respostas: FeedbackResposta[];
  comentario: string;
};

interface FeedbackProps {
  barraca: Barraca;
  pontosAtuais: number;
  onRegistrarFeedback: (_feedback: FeedbackQuestionario) => void;
  onFinalizar: () => void;
}

const conjuntos = questionarios.conjuntos as ConjuntoFeedback[];

function escolherConjuntoAleatorio(): ConjuntoFeedback {
  const indice = Math.floor(Math.random() * conjuntos.length);
  return conjuntos[indice] ?? conjuntos[0];
}

export default function Feedback({
  barraca,
  pontosAtuais,
  onRegistrarFeedback,
  onFinalizar,
}: FeedbackProps) {
  const [conjunto] = useState<ConjuntoFeedback>(() => escolherConjuntoAleatorio());
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<FeedbackResposta[]>([]);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  const [comentario, setComentario] = useState("");
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    const respostaExistente = respostas.find(
      (item) => item.perguntaId === conjunto.perguntas[etapa]?.id,
    );
    setRespostaSelecionada(respostaExistente?.respostaId ?? null);
  }, [conjunto.perguntas, etapa, respostas]);

  const perguntaAtual = conjunto.perguntas[etapa];
  const totalEtapas = conjunto.perguntas.length + 1;
  const ehUltimaPergunta = etapa === conjunto.perguntas.length - 1;
  const naEtapaComentario = etapa === conjunto.perguntas.length;

  const selecionarResposta = (opcao: OpcaoFeedback) => {
    if (!perguntaAtual) return;

    setRespostaSelecionada(opcao.id);
    setRespostas((prev) => {
      const filtradas = prev.filter((item) => item.perguntaId !== perguntaAtual.id);
      return [
        ...filtradas,
        {
          perguntaId: perguntaAtual.id,
          perguntaTexto: perguntaAtual.texto,
          respostaId: opcao.id,
          respostaTexto: opcao.texto,
        },
      ];
    });
  };

  const avancar = () => {
    if (!perguntaAtual || !respostaSelecionada) return;
    setEtapa((prev) => prev + 1);
  };

  const voltar = () => {
    if (etapa === 0) return;
    setEtapa((prev) => prev - 1);
  };

  const concluir = () => {
    if (respostas.length !== conjunto.perguntas.length) return;

    onRegistrarFeedback({
      conjuntoId: conjunto.id,
      respostas,
      comentario: comentario.trim(),
    });
    setFinalizado(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F0] text-[#1A1613] font-sans flex justify-center selection:bg-[#FFB800] selection:text-[#1A1613]">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#FAF7F0] border-x-2 border-[#1A1613] shadow-xl overflow-hidden relative">
        <div className="bg-gradient-to-b from-[#E65C00] to-[#FFA800] text-white p-5 pt-7 rounded-b-[32px] shadow-[0_8px_24px_rgba(26,22,19,0.14)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] opacity-80">
                Feedback da barraca
              </p>
              <h1 className="text-2xl font-black tracking-tight mt-1 leading-tight">
                Conte como foi a visita
              </h1>
              <p className="text-sm font-medium text-white/85 mt-2">
                {barraca.nome} · {barraca.responsavel}
              </p>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/15 border border-white/25 px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                Bônus
              </p>
              <p className="text-2xl font-black leading-none">+20</p>
            </div>
          </div>
        </div>

        {!finalizado ? (
          <div className="flex-1 px-5 py-6 flex flex-col gap-5">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">
              <span>{conjunto.titulo}</span>
              <span>
                {Math.min(etapa + 1, totalEtapas)}/{totalEtapas}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#E7E1D7] overflow-hidden border border-[#1A1613]/10">
              <div
                className="h-full bg-[#C84B24] rounded-full transition-all duration-300"
                style={{ width: `${((etapa + 1) / totalEtapas) * 100}%` }}
              />
            </div>

            <div className="bg-white border-2 border-[#1A1613] rounded-[28px] shadow-[5px_5px_0px_0px_#1A1613] p-5 flex-1 flex flex-col gap-5">
              {naEtapaComentario ? (
                <>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E65C00]">
                      Comentário opcional
                    </p>
                    <h2 className="text-xl font-black tracking-tight leading-tight">
                      Quer deixar uma observação sobre o lugar?
                    </h2>
                    <p className="text-sm font-medium text-gray-600">
                      Se preferir, você pode pular esta etapa.
                    </p>
                  </div>

                  <textarea
                    value={comentario}
                    onChange={(event) => setComentario(event.target.value)}
                    placeholder="Escreva aqui o que achou da experiência..."
                    className="min-h-40 w-full resize-none rounded-3xl border-2 border-[#1A1613] bg-[#FAF7F0] px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-[#FFB800]/25"
                  />

                  <div className="mt-auto flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setComentario("");
                        concluir();
                      }}
                      className="flex-1 h-14 rounded-2xl border-2 border-[#1A1613] bg-white text-[#1A1613] font-black shadow-[3px_3px_0px_0px_#1A1613] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      Pular
                    </button>
                    <button
                      type="button"
                      onClick={concluir}
                      className="flex-[1.4] h-14 rounded-2xl border-2 border-[#1A1613] bg-gradient-to-r from-[#C84B24] to-[#A33614] text-white font-black shadow-[3px_3px_0px_0px_#1A1613] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      Finalizar e ganhar 20 pts
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E65C00]">
                      Pergunta {etapa + 1}
                    </p>
                    <h2 className="text-xl font-black tracking-tight leading-tight">
                      {perguntaAtual?.texto}
                    </h2>
                  </div>

                  <div className="grid gap-3">
                    {perguntaAtual?.opcoes.map((opcao) => {
                      const selecionada = respostaSelecionada === opcao.id;

                      return (
                        <button
                          key={opcao.id}
                          type="button"
                          onClick={() => selecionarResposta(opcao)}
                          className={`w-full min-h-14 rounded-2xl border-2 px-4 py-3 text-left font-bold transition-all shadow-[3px_3px_0px_0px_#1A1613] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${selecionada ? "bg-[#FFB800] border-[#1A1613] text-[#1A1613]" : "bg-white border-[#1A1613] text-[#1A1613]"}`}
                        >
                          {opcao.texto}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-auto flex gap-3">
                    <button
                      type="button"
                      onClick={voltar}
                      disabled={etapa === 0}
                      className="h-14 flex-1 rounded-2xl border-2 border-[#1A1613] bg-white text-[#1A1613] font-black shadow-[3px_3px_0px_0px_#1A1613] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={avancar}
                      disabled={!respostaSelecionada}
                      className="h-14 flex-[1.4] rounded-2xl border-2 border-[#1A1613] bg-gradient-to-r from-[#C84B24] to-[#A33614] text-white font-black shadow-[3px_3px_0px_0px_#1A1613] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      {ehUltimaPergunta ? "Ir para comentário" : "Próxima"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 px-5 py-8 flex items-center justify-center">
            <div className="w-full bg-white border-2 border-[#1A1613] rounded-[32px] shadow-[5px_5px_0px_0px_#1A1613] p-6 text-center space-y-5">
              <div className="mx-auto w-20 h-20 rounded-full bg-[#FFB800] border-2 border-[#1A1613] flex items-center justify-center text-4xl shadow-[3px_3px_0px_0px_#1A1613]">
                🎉
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight">
                  Obrigado pelo feedback!
                </h2>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  Sua opinião ajuda a melhorar a experiência da barraca.
                </p>
              </div>
              <div className="rounded-[28px] bg-gradient-to-r from-[#FFA800] to-[#E65C00] border-2 border-[#1A1613] p-5 text-[#1A1613] shadow-[3px_3px_0px_0px_#1A1613]">
                <p className="text-xs font-black uppercase tracking-[0.24em] opacity-80">
                  Você ganhou
                </p>
                <p className="text-5xl font-black leading-none mt-1">+20</p>
                <p className="text-sm font-black mt-2">pontos no seu passaporte</p>
              </div>
              <p className="text-sm font-bold text-[#1A1613]">
                Saldo atualizado: {pontosAtuais} pontos
              </p>
              <button
                type="button"
                onClick={onFinalizar}
                className="w-full h-14 rounded-2xl border-2 border-[#1A1613] bg-[#1A1613] text-white font-black shadow-[3px_3px_0px_0px_#1A1613] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                Continuar para o passaporte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}