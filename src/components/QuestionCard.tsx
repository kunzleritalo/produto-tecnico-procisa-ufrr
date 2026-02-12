import { Question } from "@/data/exams";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  onSelect: (value: number) => void;
}

const QuestionCard = ({ question, selectedOption, onSelect }: QuestionCardProps) => {
  const options = Array.from({ length: question.numOptions }, (_, i) => i + 1);

  return (
    <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-1 leading-relaxed">{question.text}</h3>
      {question.inverted && (
        <p className="text-xs text-muted-foreground mb-4 italic">Pontuação invertida</p>
      )}
      <div className="flex gap-3 flex-wrap">
        {options.map((value) => {
          const isSelected = selectedOption === value;
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={cn(
                "w-12 h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-sm font-bold",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-secondary/60 text-muted-foreground"
              )}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
