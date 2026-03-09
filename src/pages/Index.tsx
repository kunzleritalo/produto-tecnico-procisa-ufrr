import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { exams } from "@/data/exams";
import QuizPlayer from "@/components/QuizPlayer";
import { ArrowRight, HeartPulse, Briefcase, Info, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import procisaLogo from "@/assets/procisa-logo.png";
import ufrrLogo from "@/assets/ufrr-logo.png";

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
        {phase === "welcome" && (
          <>
            <div className="max-w-2xl mx-auto text-center">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8">
                <img src={procisaLogo} alt="Logo PROCISA" className="h-16 object-contain" />
              </div>

              {/* Hero */}
              <div className="gradient-hero rounded-2xl p-8 mb-8 border border-primary/10">
                <h2 className="text-4xl font-bold mb-3 tracking-tight">
                  Bem-vindo(a)
                </h2>
                <p className="text-muted-foreground text-base mb-2 max-w-lg mx-auto leading-relaxed">
                  Esta ferramenta possibilita a realização de escalas validadas para o levantamento de indicativos de estresse. Você pode realizar as escalas individualmente ou ambas em sequência.
                </p>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                  Ao final, será apresentado os escores obtidos com as respectivas classificações, podendo ser enviado por e-mail para registro pessoal.
                </p>
              </div>

              {/* Instruções gerais */}
              <div className="rounded-xl border border-border bg-card p-5 max-w-lg mx-auto mb-8 text-left card-elevated">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Info className="w-4 h-4 text-primary shrink-0" />
                  </div>
                  <p className="text-sm font-semibold">Instruções gerais</p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-2 list-none pl-0">
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Leia cada item com atenção e selecione a alternativa que melhor representa a sua percepção.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Não existem respostas certas ou erradas — responda de acordo com o que você realmente sente ou vivencia.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Todas as questões precisam ser respondidas para que o resultado seja calculado.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Leve o tempo que for necessário.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span className="font-semibold">Seus dados não são armazenados — os resultados são calculados localmente no seu dispositivo.</span></li>
                </ul>
              </div>

              {/* Cartões das escalas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto mb-8">
                <div className="rounded-xl border border-border bg-card p-5 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HeartPulse className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Escala 01</p>
                  </div>
                  <p className="font-semibold text-sm mb-1.5">PSS-10 – Escala de Estresse Percebido</p>
                  <p className="text-muted-foreground text-left text-xs leading-relaxed">Busca conhecer informações acerca do construto de "Estresse autopercebido"</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 bg-accent/50 px-2 py-0.5 rounded-full">{exams[0].questions.length} itens</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-3 leading-tight text-left">
                    Cohen, S., Kamarck, T., & Mermelstein, R. (1983); Siqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010).
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Escala 02</p>
                  </div>
                  <p className="font-semibold text-sm mb-1.5">EET – Escala de Estresse no Trabalho</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Busca melhor compreender o construto de "Estresse ocupacional"</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 bg-accent/50 px-2 py-0.5 rounded-full">{exams[1].questions.length} itens</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-3 leading-tight">
                    PASCHOAL, T.; TAMAYO, A. (2004).
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-md mx-auto">
                {/* Botão principal — ambas as escalas */}
                <button
                  onClick={() => startExams("both")}
                  className="group relative w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
                    Realizar ambas as escalas
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="relative flex items-center justify-center gap-1 text-[11px] sm:text-xs font-normal opacity-80 mt-1">
                    PSS-10 e EET · <Clock className="w-3 h-3" /> ~10 min
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {/* Botão PSS-10 */}
                  <button
                    onClick={() => startExams("pss10")}
                    className="group w-full rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-accent/30 px-3 sm:px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="block font-semibold text-xs sm:text-sm mb-1 group-hover:text-primary transition-colors duration-300">Escala PSS-10</span>
                    <span className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3 shrink-0 group-hover:animate-[spin_2s_ease-in-out_1]" />
                      <span>~3 min</span>
                    </span>
                  </button>

                  {/* Botão EET */}
                  <button
                    onClick={() => startExams("eet")}
                    className="group w-full rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-accent/30 px-3 sm:px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="block font-semibold text-xs sm:text-sm mb-1 group-hover:text-primary transition-colors duration-300">Escala EET</span>
                    <span className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3 shrink-0 group-hover:animate-[spin_2s_ease-in-out_1]" />
                      <span>~7 min</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <Suspense fallback={<Skeleton className="h-64 w-full max-w-3xl mx-auto mt-16 rounded-xl" />}>
              <AboutSection />
            </Suspense>
          </>
        )}

        {phase === "exam1" && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src={procisaLogo} alt="Logo PROCISA" className="h-10 object-contain" />
              <div className="w-px h-8 bg-border" />
              <img src={ufrrLogo} alt="Brasão UFRR" className="h-10 object-contain" />
            </div>
            <QuizPlayer exam={exams[0]} onFinish={handleFinishExam1} />
          </div>
        )}

        {phase === "exam2" && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src={procisaLogo} alt="Logo PROCISA" className="h-10 object-contain" />
              <div className="w-px h-8 bg-border" />
              <img src={ufrrLogo} alt="Brasão UFRR" className="h-10 object-contain" />
            </div>
            <QuizPlayer exam={exams[1]} onFinish={handleFinishExam2} />
          </div>
        )}

        {phase === "results" && (
          <Suspense fallback={<Skeleton className="h-64 w-full max-w-3xl mx-auto rounded-xl" />}>
            <ResultsView results={results} mode={mode} onRestart={restart} />
          </Suspense>
        )}
      </main>

      <footer className="w-full border-t border-border bg-card mt-16 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center text-[11px] text-muted-foreground/80 leading-relaxed space-y-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={procisaLogo} alt="Logo PROCISA" className="h-8 opacity-60" />
            <div className="w-px h-6 bg-border" />
            <img src={ufrrLogo} alt="Brasão UFRR" className="h-8 opacity-60" />
          </div>
          <p className="font-semibold text-muted-foreground">Esta ferramenta tem finalidade exclusivamente pedagógica e/ou para fins de levantamento de informações acerca dos construtos de estresse.</p>
          <p>
            Todos os direitos sobre as escalas pertencem aos seus respectivos criadores. Qualquer uso com finalidade diferente da proposta por esse instrumento não é de responsabilidade dos criadores desta ferramenta.
          </p>
          <div className="space-y-1 pt-2 border-t border-border/50">
            <p><strong>PSS-10</strong> Produzida por Cohen, S., Kamarck, T., &amp; Mermelstein, R. (1983). Adaptação e tradução por Siqueira Reis, R., Ferreira Hino, A. A., &amp; Romélio Rodriguez Añez, C. (2010).</p>
            <p><strong>EET</strong> Produzida por Paschoal, T. &amp; Tamayo, A. (2004).</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
