
import { Card } from '@/components/ui/card';

export const ConfirmationLoading = () => {
  return (
    <Card className="p-8 max-w-md w-full text-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <h2 className="text-xl font-medium mb-2">Processando...</h2>
      <p className="text-gray-500">Aguarde enquanto processamos sua solicitação.</p>
    </Card>
  );
};
