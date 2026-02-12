import { Exam } from "@/data/exams";
import { CheckCircle2, XCircle, BarChart3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamResult {
  exam: Exam;
  answers: Record<string, string>;
}

interface ResultsViewProps {
  results: ExamResult[];
  onRestart: () => void;
}

function calculateWeightedAverage(exam: Exam, answers: Record<string, string>) {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const q of exam.questions) {
    const selected = answers[q.id];
    const correct = q.options.find((o) => o.isCorrect);
    const score = selected === correct?.id ? q.maxScore : 0;
    totalWeightedScore += score * q.weight;
    totalWeight += q.weight;
  }

  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
}

const ResultsView = ({ results, onRestart }: ResultsViewProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Resultado Final</h2>
        <p className="text-muted-foreground">Confira o desempenho em cada prova</p>
      </div>

      <div className="grid gap-8">
        {results.map(({ exam, answers }) => {
          const average = calculateWeightedAverage(exam, answers);
          return (
            <div key={exam.id} className="rounded-xl bg-card border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{exam.title}</h3>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Média Ponderada</p>
                  <p className="text-3xl font-bold text-primary">{average.toFixed(1)}</p>
                </div>
              </div>

              <div className="space-y-3">
                {exam.questions.map((q) => {
                  const selected = answers[q.id];
                  const correct = q.options.find((o) => o.isCorrect);
                  const isCorrect = selected === correct?.id;
                  const score = isCorrect ? q.maxScore : 0;

                  return (
                    <div
                      key={q.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug">{q.text}</p>
                        {!isCorrect && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Resposta correta: {correct?.text}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold">{score}/{q.maxScore}</p>
                        <p className="text-xs text-muted-foreground">peso {q.weight}</p>
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
