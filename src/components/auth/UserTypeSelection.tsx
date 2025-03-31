import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserIcon, Users, Building2 } from "lucide-react";

type UserType = "student" | "guardian" | "institution";

interface UserTypeSelectionProps {
  onSelect: (type: UserType) => void;
}

export default function UserTypeSelection({
  onSelect,
}: UserTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleSelect = (type: UserType) => {
    setSelectedType(type);
    onSelect(type);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-center mb-2">
          Selecione seu tipo de conta
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Escolha o tipo de conta que melhor se adequa ao seu perfil
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`cursor-pointer transition-all ${selectedType === "student" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
          onClick={() => handleSelect("student")}
        >
          <CardHeader className="pb-2">
            <div className="mx-auto bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-center mt-2">Estudante</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Para estudantes que desejam compartilhar sua localização com
              responsáveis
            </CardDescription>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedType === "guardian" ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"}`}
          onClick={() => handleSelect("guardian")}
        >
          <CardHeader className="pb-2">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-center mt-2">Responsável</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Para pais e responsáveis que desejam monitorar a localização dos
              estudantes
            </CardDescription>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedType === "institution" ? "ring-2 ring-purple-500 bg-purple-50" : "hover:bg-gray-50"}`}
          onClick={() => handleSelect("institution")}
        >
          <CardHeader className="pb-2">
            <div className="mx-auto bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-center mt-2">Instituição</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Para escolas e instituições de ensino que desejam gerenciar
              estudantes
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => selectedType && onSelect(selectedType)}
          disabled={!selectedType}
          className="w-full md:w-auto"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
