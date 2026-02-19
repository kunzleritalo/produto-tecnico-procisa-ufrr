import { Question } from "@/data/exams";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  onSelect: (value: number) => void;
  optionLabels?: string[];
  startFrom?: number;
}

const QuestionCard = ({ question, selectedOption, onSelect, optionLabels, startFrom = 0 }: QuestionCardProps) => {
  const options = Array.from({ length: question.numOptions }, (_, i) => i + startFrom);

  return (
    <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-1 leading-relaxed">{question.text}</h3>
      {question.inverted &&
      <p className="text-xs text-muted-foreground mb-4 italic">​</p>
      }
      <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        {options.map((value) => {
          const isSelected = selectedOption === value;
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={cn(
                "min-w-12 h-auto rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center text-sm font-bold px-3 py-2 gap-1",
                isSelected ?
                "border-primary bg-primary text-primary-foreground shadow-sm" :
                "border-border hover:border-primary/40 hover:bg-secondary/60 text-muted-foreground"
              )}>

              <span>{value}</span>
              {optionLabels?.[value] &&
              <span className="text-[10px] font-normal leading-tight text-center">
                  {optionLabels[value]}
                </span>
              }
            </button>);

        })}
      </div>
    </div>);

};

export default QuestionCard;