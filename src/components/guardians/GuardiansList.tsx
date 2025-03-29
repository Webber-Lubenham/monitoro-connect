
import React from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import GuardianCard, { GuardianProps } from './GuardianCard';
import { useNavigate } from 'react-router-dom';

const GuardiansList = () => {
  const navigate = useNavigate();
  
  const guardians: GuardianProps[] = [
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria.silva@example.com',
      phone: '(11) 98765-4321',
      status: 'active',
      type: 'primary',
    },
    {
      id: '2',
      name: 'João Pereira',
      email: 'joao.pereira@example.com',
      status: 'active',
      type: 'secondary',
    },
    {
      id: '3',
      name: 'Ana Santos',
      email: 'ana.santos@example.com',
      status: 'pending',
      type: 'secondary',
    }
  ];
  
  return (
    <Card className="card-gradient">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-monitoro-500" />
              Meus Responsáveis
            </CardTitle>
            <CardDescription>
              Gerencie quem pode monitorar sua localização
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-monitoro-600 border-monitoro-200 hover:bg-monitoro-50"
            onClick={() => navigate('/responsaveis')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {guardians.map(guardian => (
          <GuardianCard key={guardian.id} guardian={guardian} />
        ))}
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full text-monitoro-600"
          onClick={() => navigate('/responsaveis')}
        >
          Ver todos os responsáveis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuardiansList;
