
import { User } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const ProfileCard = () => {
  return (
    <Card className="p-6 shadow-lg border-none bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors cursor-pointer">
          <User className="w-16 h-16 text-secondary-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Interface do Aluno</h2>
          <p className="text-gray-600">Gerenciamento de Responsáveis e Notificações</p>
        </div>
      </div>
    </Card>
  );
};
