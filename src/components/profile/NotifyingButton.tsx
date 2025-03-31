
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';

interface NotifyingButtonProps {
  isNotifying: boolean;
}

const NotifyingButton = ({ isNotifying }: NotifyingButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      className="w-full"
      size={isMobile ? "lg" : "lg"}
      disabled={true}
      type="button"
      variant="secondary"
    >
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Enviando notificação...
    </Button>
  );
};

export default NotifyingButton;
