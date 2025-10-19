import { TranslationModal } from '../TranslationModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TranslationModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-modal">
        Show Translation
      </Button>
      <TranslationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        spanishWord="CASA"
        englishTranslation="House"
        definition="A building for human habitation, especially one that is lived in by a family or small group of people."
        points={24}
      />
    </div>
  );
}
