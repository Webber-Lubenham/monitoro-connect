
import React from 'react';
import { Bell, ArrowRight, User, Map, Settings, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'guardian' | 'location' | 'system' | 'privacy';
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'guardian':
      return <User className="h-5 w-5 text-blue-500" />;
    case 'location':
      return <Map className="h-5 w-5 text-green-500" />;
    case 'system':
      return <Settings className="h-5 w-5 text-purple-500" />;
    case 'privacy':
      return <Info className="h-5 w-5 text-yellow-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const NotificationCenter = () => {
  const navigate = useNavigate();
  
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'guardian',
      title: 'Novo responsável adicionado',
      description: 'Maria Silva aceitou seu convite para ser sua responsável.',
      time: '10 minutos atrás',
      read: false,
      icon: getNotificationIcon('guardian')
    },
    {
      id: '2',
      type: 'location',
      title: 'Compartilhamento ativado',
      description: 'Seu compartilhamento de localização foi ativado com sucesso.',
      time: '1 hora atrás',
      read: true,
      icon: getNotificationIcon('location')
    },
    {
      id: '3',
      type: 'system',
      title: 'Atualização do sistema',
      description: 'Nova versão do aplicativo está disponível.',
      time: '1 dia atrás',
      read: true,
      icon: getNotificationIcon('system')
    }
  ];
  
  return (
    <Card className="card-gradient">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-monitoro-500" />
              Notificações recentes
            </CardTitle>
            <CardDescription>
              Atualizações e alertas do sistema
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-monitoro-600"
            onClick={() => navigate('/notificacoes')}
          >
            Ver todas
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 rounded-lg border ${
                notification.read 
                  ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700' 
                  : 'bg-monitoro-50 dark:bg-monitoro-900/10 border-monitoro-100 dark:border-monitoro-800/20'
              }`}
            >
              <div className="flex gap-3">
                <div className="mt-0.5">{notification.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-medium ${!notification.read ? 'text-monitoro-800 dark:text-monitoro-300' : ''}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notification.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 bg-monitoro-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
