
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface GuardianButtonProps {
  onShowForm: () => void;
  disabled?: boolean;
}

const GuardianButton = ({ onShowForm, disabled = false }: GuardianButtonProps) => {
  const isMobile = useIsMobile();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onShowForm();
  };

  return (
    <Button 
      onClick={handleClick}
      variant="secondary"
      className="w-full"
      size={isMobile ? "lg" : "lg"}
      disabled={disabled}
      type="button"
    >
      <UserPlus className="mr-2 h-5 w-5" />
      Cadastrar Responsável
    </Button>
  );
};

export default GuardianButton;
