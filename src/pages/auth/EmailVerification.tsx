
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EmailVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando seu email...');

  useEffect(() => {
    // Check URL for confirmation token
    const checkSession = async () => {
      // If already authenticated, no need to verify email
      if (user) {
        setStatus('success');
        setMessage('Email verificado com sucesso!');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      // Try to get session from URL if present
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setStatus('error');
        setMessage('Ocorreu um erro ao verificar seu email. Tente novamente mais tarde.');
        return;
      }
      
      if (data.session) {
        setStatus('success');
        setMessage('Email verificado com sucesso!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setStatus('error');
        setMessage('Link de verificação expirado ou inválido. Faça login para reenviar o email de verificação.');
      }
    };

    checkSession();
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="h-12 w-12 bg-monitor-500 rounded-lg flex items-center justify-center mb-2">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verificação de Email</CardTitle>
          <CardDescription className="text-center">
            {status === 'loading' && 'Verificando seu email...'}
            {status === 'success' && 'Email verificado com sucesso!'}
            {status === 'error' && 'Verificação de email pendente'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {status === 'loading' && (
            <div className="w-12 h-12 border-4 border-monitor-200 border-t-monitor-500 rounded-full animate-spin mb-4"></div>
          )}
          
          {status === 'success' && (
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          )}
          
          {status === 'error' && (
            <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
          )}
          
          <p className="text-center mb-6">{message}</p>
          
          {status === 'error' && (
            <div className="space-y-4 w-full">
              <Link to="/auth/login">
                <Button className="w-full">Ir para o login</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
