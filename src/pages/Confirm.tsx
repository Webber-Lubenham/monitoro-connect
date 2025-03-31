
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ConfirmationLoading } from '@/components/auth/confirmation/ConfirmationLoading';
import { ConfirmationError } from '@/components/auth/confirmation/ConfirmationError';
import { ConfirmationSuccess } from '@/components/auth/confirmation/ConfirmationSuccess';
import { ConfirmationProcessing } from '@/components/auth/confirmation/ConfirmationProcessing';
import { TokenTypeHandler } from '@/components/auth/confirmation/TokenTypeHandler';
import { useConfirmationLogic } from '@/components/auth/confirmation/useConfirmationLogic';

const Confirm = () => {
  const [searchParams] = useSearchParams();
  
  const type = searchParams.get('type');
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const {
    loading,
    error,
    success,
    processing,
    tokenType,
    handleGuardianSignupSuccess
  } = useConfirmationLogic({ type, token, email });
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary p-4">
        <ConfirmationLoading />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary p-4">
        <ConfirmationError error={error} />
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary p-4">
        <ConfirmationSuccess />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {processing ? (
          <ConfirmationProcessing />
        ) : (
          <TokenTypeHandler 
            tokenType={tokenType}
            token={token}
            email={email}
            onSuccess={handleGuardianSignupSuccess}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Confirm;
