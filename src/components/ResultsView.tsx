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
          const startFrom = exam.startFrom ?? 0;
          const maxPerItem = (exam.questions[0]?.numOptions ?? 1) - 1 + startFrom;
          const maxPossible = exam.questions.length * maxPerItem;
          const totalScore = exam.questions.reduce((sum, q) => {
            const selected = answers[q.id];
            return sum + (selected != null ? getScore(q, selected) : 0);
          }, 0);

          const getStressLevel = (score: number) => {
            if (score <= 18) return { label: "Estresse Baixo", color: "text-green-600" };
            if (score <= 24) return { label: "Estresse Normal", color: "text-yellow-600" };
            if (score <= 35) return { label: "Estresse Alto", color: "text-orange-600" };
            return { label: "Estresse Muito Alto", color: "text-red-600" };
          };

          const getEETStressLevel = (avg: number) => {
            if (avg < 2.5) return { label: "Estresse Baixo ou Leve", color: "text-green-600" };
            if (avg === 2.5) return { label: "Estresse Médio/Considerável", color: "text-yellow-600" };
            return { label: "Estresse Alto", color: "text-red-600" };
          };

          const stressLevel = exam.id === "prova1" ? getStressLevel(totalScore) : null;
          const eetAvg = exam.id === "prova2" ? parseFloat((totalScore / 23).toFixed(2)) : null;
          const eetStressLevel = eetAvg != null ? getEETStressLevel(eetAvg) : null;

          return (
            <div key={exam.id} className="rounded-xl bg-card border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{exam.title}</h3>
                <div className="text-right">
                  {exam.id === "prova1" && (
                    <>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Pontuação Total</p>
                      <p className="text-3xl font-bold text-primary">
                        {totalScore}<span className="text-base text-muted-foreground font-normal">/{maxPossible}</span>
                      </p>
                    </>
                  )}
                  {exam.id === "prova2" && eetAvg != null && (
                    <>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Média Final</p>
                      <p className="text-3xl font-bold text-primary">
                        {eetAvg.toFixed(2)}
                      </p>
                    </>
                  )}
                  {stressLevel && (
                    <p className={`text-sm font-semibold mt-1 ${stressLevel.color}`}>
                      {stressLevel.label}
                    </p>
                  )}
                  {eetStressLevel && (
                    <p className={`text-sm font-semibold mt-1 ${eetStressLevel.color}`}>
                      {eetStressLevel.label}
                    </p>
                  )}
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
