import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  spanishWord: string;
  englishTranslation: string;
  definition: string;
  points: number;
}

export function TranslationModal({
  isOpen,
  onClose,
  spanishWord,
  englishTranslation,
  definition,
  points,
}: TranslationModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-testid="translation-modal"
    >
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={onClose}
        data-testid="modal-backdrop"
      />
      <div className="relative bg-card border border-card-border rounded-lg shadow-xl max-w-md w-full p-8 animate-in fade-in duration-200">
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onClick={onClose}
          data-testid="button-close-modal"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-serif font-bold text-foreground">
              {spanishWord}
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              {englishTranslation}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Definition
            </h3>
            <p className="text-base leading-relaxed text-foreground">
              {definition}
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Points Earned
              </span>
              <span className="text-3xl font-bold text-primary">
                {points}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
