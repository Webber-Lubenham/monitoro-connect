
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormErrors } from '@/hooks/guardians';
import { GuardianForm as GuardianFormType } from '@/types/database.types';

interface GuardianFormProps {
  newGuardian: GuardianFormType;
  errors: FormErrors;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (guardian: GuardianFormType) => void;
}

export const GuardianForm = ({
  newGuardian,
  errors,
  onClose,
  onSubmit,
  onChange,
}: GuardianFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit();
    setIsSubmitting(false);
  };

  const handleChange = (field: keyof GuardianFormType, value: string | boolean) => {
    onChange({
      ...newGuardian,
      [field]: value,
    });
  };

  return (
    <Card className="p-6 shadow-lg border-none bg-white/90 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Adicionar Responsável</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo*</Label>
          <Input
            id="nome"
            value={newGuardian.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Nome do responsável"
            required
          />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            value={newGuardian.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Email do responsável"
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone*</Label>
          <Input
            id="telefone"
            value={newGuardian.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            placeholder="(00) 00000-0000"
            required
          />
          {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF (opcional)</Label>
          <Input
            id="cpf"
            value={newGuardian.cpf || ''}
            onChange={(e) => handleChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
          />
          {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_primary"
            checked={newGuardian.is_primary}
            onCheckedChange={(checked) => handleChange('is_primary', checked)}
          />
          <Label htmlFor="is_primary">Responsável Principal</Label>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                Salvando...
              </>
            ) : (
              'Adicionar'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
