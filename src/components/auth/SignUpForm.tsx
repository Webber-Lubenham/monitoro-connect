import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import UserTypeSelection from "./UserTypeSelection";
import StudentSignUpForm from "./StudentSignUpForm";
import GuardianSignUpForm from "./GuardianSignUpForm";
import InstitutionSignUpForm from "./InstitutionSignUpForm";

type UserType = "student" | "guardian" | "institution" | null;

export default function SignUpForm() {
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
  };

  const handleBack = () => {
    setUserType(null);
  };

  return (
    <AuthLayout>
      {!userType ? (
        <UserTypeSelection onSelect={handleUserTypeSelect} />
      ) : (
        <div>
          {userType === "student" && <StudentSignUpForm />}
          {userType === "guardian" && <GuardianSignUpForm />}
          {userType === "institution" && <InstitutionSignUpForm />}

          <div className="mt-4 text-center">
            <button
              onClick={handleBack}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Voltar para seleção de tipo de usuário
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
