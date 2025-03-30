
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { sendGuardianInvite } from "@/services/guardian/invitations/invitationService";
import { Loader2 } from "lucide-react";

const TestGuardianInvite = () => {
  const { toast } = useToast();
  const [guardianName, setGuardianName] = useState("Mauro Lima");
  const [guardianEmail, setGuardianEmail] = useState("mauro.lima@educacao.am.gov.br");
  const [guardianPhone, setGuardianPhone] = useState("92998765432");
  const [studentName, setStudentName] = useState("Sarah Lima");
  const [loading, setLoading] = useState(false);

  const handleSendInvite = async () => {
    try {
      setLoading(true);
      
      // Para fins de teste, estamos usando um ID de estudante fixo
      // Em um cenário real, isso seria obtido do usuário autenticado
      const studentId = "7f8d9e6a-5b4c-3d2e-1f0a-9e8d7f6a5b4c";
      
      const result = await sendGuardianInvite({
        studentId,
        studentName,
        guardianName,
        guardianEmail,
        guardianPhone,
        isPrimary: true
      });
      
      if (result.success) {
        toast({
          title: "Convite enviado com sucesso!",
          description: `Um convite foi enviado para ${guardianEmail}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao enviar convite",
          description: result.error || "Ocorreu um erro ao enviar o convite.",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar convite",
        description: "Ocorreu um erro inesperado ao enviar o convite.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-10 p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Teste de Convite para Responsável</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nome do Estudante</label>
            <Input 
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nome do estudante"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Nome do Responsável</label>
            <Input 
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              placeholder="Nome do responsável"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Email do Responsável</label>
            <Input 
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
              placeholder="Email do responsável"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Telefone do Responsável</label>
            <Input 
              value={guardianPhone}
              onChange={(e) => setGuardianPhone(e.target.value)}
              placeholder="Telefone do responsável"
            />
          </div>
          
          <Button 
            onClick={handleSendInvite}
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando convite...
              </>
            ) : (
              'Enviar Convite'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TestGuardianInvite;
