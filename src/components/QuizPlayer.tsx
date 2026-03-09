import { useState } from "react";
import { Exam } from "@/data/exams";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface QuizPlayerProps {
  exam: Exam;
  onFinish: (answers: Record<string, number>) => void;
}

const QuizPlayer = ({ exam, onFinish }: QuizPlayerProps) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const total = exam.questions.length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === total;

  const selectAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">{exam.title}</h2>
        <p className="text-muted-foreground text-sm mb-3">{exam.description}</p>
        {exam.instructions && (
          <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm text-foreground whitespace-pre-line">
            {exam.instructions}
          </div>
        )}
      </div>

      <div className="w-full h-2.5 rounded-full bg-secondary/40 mb-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mb-8">{answered} de {total} respondidos</p>

      <div className="space-y-6">
        {exam.questions.map((question, idx) => (
          <div key={question.id}>
            <div className="mb-2 text-sm text-muted-foreground">
              <span>Questão {idx + 1}</span>
            </div>
            <QuestionCard
              question={question}
              selectedOption={answers[question.id] ?? null}
              onSelect={(value) => selectAnswer(question.id, value)}
              optionLabels={exam.optionLabels}
              startFrom={exam.startFrom}
            />
          </div>
        ))}
      </div>

      {exam.id === "prova1" && (
        <div className="rounded-lg border border-border bg-secondary/30 p-4 mt-6 text-xs text-muted-foreground space-y-2">
          <p>COHEN, S., KAMARCK, T., & MERMELSTEIN, R. (1983). A global measure of perceived stress. <em>Journal of Health and Social Behavior</em>, 24, 385-396.</p>
          <p>SIQUEIRA REIS, R., FERREIRA HINO, A. A., & ROMÉLIO RODRIGUEZ AÑEZ, C. (2010). Perceived stress scale: Reliability and validity study in Brazil. <em>Journal of health psychology</em>, 15(1), 107-114.</p>
        </div>
      )}

      {exam.id === "prova2" && (
        <div className="rounded-lg border border-border bg-secondary/30 p-4 mt-6 text-xs text-muted-foreground">
          <p>PASCHOAL, T.; TAMAYO, A. Validação da escala de estresse no trabalho. <em>Estudos de Psicologia (Natal)</em>, v. 9, n. 1, p. 45-52, 2004.</p>
        </div>
      )}

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={() => onFinish(answers)} disabled={!allAnswered}>
          Finalizar <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default QuizPlayer;
