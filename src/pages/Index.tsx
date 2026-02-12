import { useState } from "react";
import { exams } from "@/data/exams";
import QuizPlayer from "@/components/QuizPlayer";
import ResultsView from "@/components/ResultsView";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";

type Phase = "welcome" | "exam1" | "exam2" | "results";

interface ExamAnswers {
  exam1: Record<string, string>;
  exam2: Record<string, string>;
}

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [answers, setAnswers] = useState<ExamAnswers>({ exam1: {}, exam2: {} });

  const handleFinishExam1 = (a: Record<string, string>) => {
    setAnswers((prev) => ({ ...prev, exam1: a }));
    setPhase("exam2");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinishExam2 = (a: Record<string, string>) => {
    setAnswers((prev) => ({ ...prev, exam2: a }));
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setAnswers({ exam1: {}, exam2: {} });
    setPhase("welcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold">Avaliação Online</h1>
        </div>
      </header>

      <main className="px-4 py-10">
        {phase === "welcome" && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Bem-vindo à Avaliação</h2>
            <p className="text-muted-foreground text-lg mb-3 max-w-md mx-auto">
              Você realizará duas provas de múltipla escolha. Cada questão possui peso e nota máxima diferentes.
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              Ao final, sua média ponderada individual será calculada para cada prova.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
              {exams.map((exam, i) => (
                <div key={exam.id} className="rounded-xl border border-border bg-card p-5 text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Prova {i + 1}</p>
                  <p className="font-semibold text-sm mb-2">{exam.title.split("—")[1]?.trim()}</p>
                  <p className="text-xs text-muted-foreground">{exam.questions.length} questões</p>
                </div>
              ))}
            </div>

            <Button size="lg" onClick={() => setPhase("exam1")}>
              Iniciar Prova <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {phase === "exam1" && (
          <QuizPlayer exam={exams[0]} onFinish={handleFinishExam1} />
        )}

        {phase === "exam2" && (
          <QuizPlayer exam={exams[1]} onFinish={handleFinishExam2} />
        )}

        {phase === "results" && (
          <ResultsView
            results={[
              { exam: exams[0], answers: answers.exam1 },
              { exam: exams[1], answers: answers.exam2 },
            ]}
            onRestart={restart}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
