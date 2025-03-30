
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const ConfirmationProcessing = () => {
  return (
    <Card className="p-6 text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p>Verificando token...</p>
    </Card>
  );
};
