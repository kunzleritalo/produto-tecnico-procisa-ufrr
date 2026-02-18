import { useState } from "react";
import { exams } from "@/data/exams";
import QuizPlayer from "@/components/QuizPlayer";
import ResultsView from "@/components/ResultsView";
import AboutSection from "@/components/AboutSection";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, HeartPulse, Briefcase } from "lucide-react";
import procisaLogo from "@/assets/procisa-logo.png";

type Phase = "welcome" | "exam1" | "exam2" | "results";
type Mode = "both" | "pss10" | "eet";

interface ExamAnswers {
  exam1: Record<string, number>;
  exam2: Record<string, number>;
}

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [mode, setMode] = useState<Mode>("both");
  const [answers, setAnswers] = useState<ExamAnswers>({ exam1: {}, exam2: {} });

  const handleFinishExam1 = (a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam1: a }));
    if (mode === "both") {
      setPhase("exam2");
    } else {
      setPhase("results");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinishExam2 = (a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam2: a }));
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startExams = (selectedMode: Mode) => {
    setMode(selectedMode);
    setAnswers({ exam1: {}, exam2: {} });
    if (selectedMode === "eet") {
      setPhase("exam2");
    } else {
      setPhase("exam1");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setAnswers({ exam1: {}, exam2: {} });
    setPhase("welcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getResults = () => {
    const results = [];
    if (mode === "both" || mode === "pss10") {
      results.push({ exam: exams[0], answers: answers.exam1 });
    }
    if (mode === "both" || mode === "eet") {
      results.push({ exam: exams[1], answers: answers.exam2 });
    }
    return results;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold">Escalas de Estresse</h1>
        </div>
      </header>

      <main className="px-4 py-10">
        {phase === "welcome" &&
        <>
            <div className="max-w-2xl mx-auto text-center">
              <img src={procisaLogo} alt="Logo PROCISA" className="h-16 mx-auto mb-6" />
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Bem-vindo</h2>
              <p className="text-muted-foreground text-lg mb-3 max-w-md mx-auto">
                Você poderá realizar as escalas individualmente ou ambas em sequência. Ao final, serão apresentados os escores obtidos.
              </p>
              



              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                <div className="rounded-xl border border-border bg-card p-5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="w-5 h-5 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Escala 1</p>
                  </div>
                  <p className="font-semibold text-sm mb-1">PSS-10 – Escala de Estresse Percebido</p>
                  <p className="text-xs text-muted-foreground">Busca conhecer informações acerca do construto de "Estresse autopercebido"</p>
                  <p className="text-xs text-muted-foreground mt-1">{exams[0].questions.length} itens</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-2 leading-tight">Cohen, S., Kamarck, T., & Mermelstein, R. (1983); Siqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010).</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Escala 2</p>
                  </div>
                  <p className="font-semibold text-sm mb-1">EET – Escala de Estresse no Trabalho</p>
                  <p className="text-xs text-muted-foreground">Busca melhor compreender o construto de "Estresse ocupacional"</p>
                  <p className="text-xs text-muted-foreground mt-1">{exams[1].questions.length} itens</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-2 leading-tight">PASCHOAL, T.; TAMAYO, A. (2004)</p>
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

            <AboutSection />
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
        <ResultsView
          results={getResults()}
          mode={mode}
          onRestart={restart} />

        }
      </main>
    </div>);

};

export default Index;