
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ConfirmationErrorProps {
  error: string;
}

export const ConfirmationError: React.FC<ConfirmationErrorProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="py-8 flex flex-col items-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold">Confirmation Error</h2>
      <p className="text-gray-500 mt-2">{error}</p>
      <Button className="mt-6" onClick={() => navigate('/login')}>
        Return to Login
      </Button>
    </div>
  );
};
