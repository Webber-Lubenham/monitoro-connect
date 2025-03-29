
import React, { useState } from 'react';
import { Users, Plus, UserPlus, Mail, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import GuardianCard, { GuardianProps } from '@/components/guardians/GuardianCard';
import { useToast } from '@/hooks/use-toast';

const Guardians = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
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
    },
    {
      id: '4',
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@example.com',
      phone: '(11) 98765-1234',
      status: 'inactive',
      type: 'secondary',
    }
  ];
  
  const filteredGuardians = guardians.filter(guardian => {
    return (
      guardian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guardian.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGuardianEmail || !newGuardianName) {
      toast({
        title: "Erro ao adicionar responsável",
        description: "Nome e email são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally add the guardian to the database
    toast({
      title: "Convite enviado com sucesso",
      description: `Um convite foi enviado para ${newGuardianEmail}.`,
    });
    
    setNewGuardianEmail('');
    setNewGuardianName('');
    setIsDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Responsáveis</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Responsável
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Responsável</DialogTitle>
              <DialogDescription>
                Envie um convite para um novo responsável acompanhar sua localização.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddGuardian}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Responsável</Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome completo"
                    value={newGuardianName}
                    onChange={(e) => setNewGuardianName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite o email"
                    value={newGuardianEmail}
                    onChange={(e) => setNewGuardianEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Enviar Convite</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar responsáveis..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {filteredGuardians.length > 0 ? (
          filteredGuardians.map(guardian => (
            <GuardianCard key={guardian.id} guardian={guardian} />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">Nenhum responsável encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {searchTerm ? 'Tente uma busca diferente' : 'Adicione seu primeiro responsável'}
            </p>
            {!searchTerm && (
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Responsável
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Guardians;
