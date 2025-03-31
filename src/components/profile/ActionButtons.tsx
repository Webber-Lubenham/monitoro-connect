
import { useState } from 'react';
import NotifyButton from './NotifyButton';
import GuardianButton from './GuardianButton';

interface ActionButtonsProps {
  onShowForm: () => void;
}

export const ActionButtons = ({ onShowForm }: ActionButtonsProps) => {
  const [isNotifying, setIsNotifying] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NotifyButton />
      <GuardianButton onShowForm={onShowForm} disabled={isNotifying} />
    </div>
  );
};
