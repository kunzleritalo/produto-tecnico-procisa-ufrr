import { Exam, getScore } from "@/data/exams";
import { BarChart3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamResult {
  exam: Exam;
  answers: Record<string, number>;
}

interface ResultsViewProps {
  results: ExamResult[];
  onRestart: () => void;
}

const ResultsView = ({ results, onRestart }: ResultsViewProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Resultado Final</h2>
        <p className="text-muted-foreground">Pontuação total de cada prova</p>
      </div>

      <div className="grid gap-8">
        {results.map(({ exam, answers }) => {
          const maxPossible = exam.questions.reduce((sum, q) => sum + (q.numOptions - 1), 0);
          const totalScore = exam.questions.reduce((sum, q) => {
            const selected = answers[q.id];
            return sum + (selected != null ? getScore(q, selected) : 0);
          }, 0);

          return (
            <div key={exam.id} className="rounded-xl bg-card border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{exam.title}</h3>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Pontuação Total</p>
                  <p className="text-3xl font-bold text-primary">
                    {totalScore}<span className="text-base text-muted-foreground font-normal">/{maxPossible}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {exam.questions.map((q) => {
                  const selected = answers[q.id];
                  const score = selected != null ? getScore(q, selected) : 0;

                  return (
                    <div
                      key={q.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{q.text}</p>
                        {q.inverted && (
                          <p className="text-xs text-muted-foreground italic">invertido</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold">
                          Resposta: {selected ?? "—"} → Pontos: {score}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Button onClick={onRestart} size="lg">
          <RotateCcw className="w-4 h-4 mr-2" /> Refazer Provas
        </Button>
      </div>
    </div>
  );
};

export default ResultsView;
