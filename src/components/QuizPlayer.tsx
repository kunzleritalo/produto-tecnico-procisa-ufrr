import { useState } from "react";
import { Exam } from "@/data/exams";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface QuizPlayerProps {
  exam: Exam;
  onFinish: (answers: Record<string, string>) => void;
}

const QuizPlayer = ({ exam, onFinish }: QuizPlayerProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const total = exam.questions.length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === total;

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">{exam.title}</h2>
        <p className="text-muted-foreground text-sm">{exam.description}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-secondary mb-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mb-8">{answered} de {total} respondidas</p>

      <div className="space-y-6">
        {exam.questions.map((question, idx) => (
          <div key={question.id}>
            <div className="mb-2 text-sm text-muted-foreground flex justify-between">
              <span>Questão {idx + 1}</span>
              <span className="font-medium">
                Peso: {question.weight} · Nota máx: {question.maxScore}
              </span>
            </div>
            <QuestionCard
              question={question}
              selectedOption={answers[question.id] || null}
              onSelect={(optionId) => selectAnswer(question.id, optionId)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={() => onFinish(answers)} disabled={!allAnswered}>
          Finalizar <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default QuizPlayer;
