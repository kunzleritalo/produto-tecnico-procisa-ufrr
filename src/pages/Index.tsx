import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { exams } from "@/data/exams";
import QuizPlayer from "@/components/QuizPlayer";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartPulse, Briefcase, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import procisaLogo from "@/assets/procisa-logo.png";

/* Lazy loading de componentes pesados */
const ResultsView = lazy(() => import("@/components/ResultsView"));
const AboutSection = lazy(() => import("@/components/AboutSection"));

type Phase = "welcome" | "exam1" | "exam2" | "results";
type Mode = "both" | "pss10" | "eet";

interface ExamAnswers {
  exam1: Record<string, number>;
  exam2: Record<string, number>;
}

const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [mode, setMode] = useState<Mode>("both");
  const [answers, setAnswers] = useState<ExamAnswers>({ exam1: {}, exam2: {} });

  const handleFinishExam1 = useCallback((a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam1: a }));
    setPhase((prev) => mode === "both" ? "exam2" : "results");
    scrollTop();
  }, [mode]);

  const handleFinishExam2 = useCallback((a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam2: a }));
    setPhase("results");
    scrollTop();
  }, []);

  const startExams = useCallback((selectedMode: Mode) => {
    setMode(selectedMode);
    setAnswers({ exam1: {}, exam2: {} });
    setPhase(selectedMode === "eet" ? "exam2" : "exam1");
    scrollTop();
  }, []);

  const restart = useCallback(() => {
    setAnswers({ exam1: {}, exam2: {} });
    setPhase("welcome");
    scrollTop();
  }, []);

  const results = useMemo(() => {
    const r = [];
    if (mode === "both" || mode === "pss10") r.push({ exam: exams[0], answers: answers.exam1 });
    if (mode === "both" || mode === "eet") r.push({ exam: exams[1], answers: answers.exam2 });
    return r;
  }, [mode, answers]);

  return (
    <div className="min-h-screen bg-background">
      



      

      <main className="px-4 py-10">
        {phase === "welcome" &&
        <>
            <div className="max-w-2xl mx-auto text-center">
              <img src={procisaLogo} alt="Logo PROCISA" className="h-16 mx-auto mb-6" />

              <h2 className="text-4xl font-bold mb-4">Bem-vindo(a)</h2>
              <p className="text-muted-foreground text-lg mb-2 max-w-lg mx-auto">
                Esta ferramenta possibilita a realização de escalas validadas para o levantamento de indicativos de estresse. Você pode realizar as escalas individualmente ou ambas em sequência.
              </p>
              <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">
                Ao final, será apresentado os escores obtidos com as respectivas classificações, podendo ser enviado por e-mail para registro pessoal.
              </p>

              {/* Instruções gerais */}
              <div className="rounded-xl border border-border bg-secondary/20 p-5 max-w-lg mx-auto mb-6 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-sm font-semibold">Instruções gerais</p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Leia cada item com atenção e selecione a alternativa que melhor representa a sua percepção.</li>
                  <li>Não existem respostas certas ou erradas — responda de acordo com o que você realmente sente ou vivencia.</li>
                  <li>Todas as questões precisam ser respondidas para que o resultado seja calculado.</li>
                  <li>Leve o tempo que for necessário.      </li>
                  <li className="font-semibold">Seus dados não são armazenados — os resultados são calculados localmente no seu dispositivo.</li>
                </ul>
              </div>

              {/* Cartões das escalas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                <div className="rounded-xl border border-border bg-card p-5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="w-5 h-5 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Escala 01</p>
                  </div>
                  <p className="font-semibold text-sm mb-1">PSS-10 – Escala de Estresse Percebido</p>
                  <p className="text-muted-foreground text-left text-xs">Busca conhecer informações acerca do construto de "Estresse autopercebido"</p>
                  <p className="text-xs text-muted-foreground mt-1">{exams[0].questions.length} itens · Tempo médio: ~3 min</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-2 leading-tight text-left">
                    Cohen, S., Kamarck, T., & Mermelstein, R. (1983); Siqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010).
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Escala 02</p>
                  </div>
                  <p className="font-semibold text-sm mb-1">EET – Escala de Estresse no Trabalho</p>
                  <p className="text-xs text-muted-foreground">Busca melhor compreender o construto de "Estresse ocupacional"</p>
                  <p className="text-xs text-muted-foreground mt-1">{exams[1].questions.length} itens</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-2 leading-tight">
                    PASCHOAL, T.; TAMAYO, A. (2004).
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <Button size="lg" onClick={() => startExams("both")} className="w-full">
                  Realizar ambas as escalas (PSS-10 e EET) <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => startExams("pss10")} className="w-full">
                  Realizar escala PSS-10
                </Button>
                <Button size="lg" variant="outline" onClick={() => startExams("eet")} className="w-full">
                  Realizar escala EET
                </Button>
              </div>
            </div>

            <Suspense fallback={<Skeleton className="h-64 w-full max-w-3xl mx-auto mt-16 rounded-xl" />}>
              <AboutSection />
            </Suspense>
          </>
        }

        {phase === "exam1" &&
        <div className="max-w-2xl mx-auto">
            <img src={procisaLogo} alt="Logo PROCISA" className="h-12 mx-auto mb-6" />
            <QuizPlayer exam={exams[0]} onFinish={handleFinishExam1} />
          </div>
        }

        {phase === "exam2" &&
        <div className="max-w-2xl mx-auto">
            <img src={procisaLogo} alt="Logo PROCISA" className="h-12 mx-auto mb-6" />
            <QuizPlayer exam={exams[1]} onFinish={handleFinishExam2} />
          </div>
        }

        {phase === "results" &&
        <Suspense fallback={<Skeleton className="h-64 w-full max-w-3xl mx-auto rounded-xl" />}>
            <ResultsView results={results} mode={mode} onRestart={restart} />
          </Suspense>
        }
      </main>

      <footer className="w-full border-t border-border bg-secondary/30 mt-16 py-6 px-4">
        <div className="max-w-3xl mx-auto text-center text-[11px] text-muted-foreground/80 leading-relaxed space-y-3">
          <p className="font-semibold text-muted-foreground">Esta ferramenta tem finalidade exclusivamente pedagógica e/ou para fins de levantamento de informações acerca dos construtos de estresse.</p>
          <p>
            Todos os direitos sobre as escalas pertencem aos seus respectivos criadores. Qualquer uso com finalidade diferente da proposta por esse instrumento não é de responsabilidade dos criadores desta ferramenta.
          </p>
          <div className="space-y-1">
            <p><strong>PSS-10</strong> Produzida por Cohen, S., Kamarck, T., &amp; Mermelstein, R. (1983). Adaptação e tradução por Siqueira Reis, R., Ferreira Hino, A. A., &amp; Romélio Rodriguez Añez, C. (2010).</p>
            <p><strong>EET</strong> Produzida por Paschoal, T. &amp; Tamayo, A. (2004).</p>
          </div>
        </div>
      </footer>
    </div>);

};

export default Index;