
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StandardNotifyButtonProps {
  onClick: () => void;
}

const StandardNotifyButton = ({ onClick }: StandardNotifyButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center w-full"
    >
      <Mail className="mr-2 h-5 w-5" />
      Notificar por E-mail
    </Button>
  );
};

export default StandardNotifyButton;
