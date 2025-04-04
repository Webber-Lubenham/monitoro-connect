import { ConfirmationLoading } from 'components/auth/confirmation/ConfirmationLoading';
import { ConfirmationError } from 'components/auth/confirmation/ConfirmationError';

// Other existing code in the file...

// Example function or component
const Confirm = () => {
  return (
    <div>
      <ConfirmationLoading />
      <ConfirmationError />
      {/* Other components or content */}
    </div>
  );
};

export default Confirm;
