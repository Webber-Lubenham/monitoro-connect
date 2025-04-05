
import React from 'react';
import { Loader2 } from 'lucide-react';

export const ConfirmationLoading: React.FC = () => {
  return (
    <div className="py-8 flex flex-col items-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-semibold">Confirming your account...</h2>
      <p className="text-gray-500 mt-2">Please wait a moment while we verify your account</p>
    </div>
  );
};
