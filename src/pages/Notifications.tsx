
import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  type: 'guardian' | 'location' | 'system' | 'privacy';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const Notifications = () => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'guardian',
      title: 'Novo responsável adicionado',
      description: 'Maria Silva aceitou seu convite para ser sua responsável.',
      time: '10 minutos atrás',
      read: false,
    },
    {
      id: '2',
      type: 'location',
      title: 'Compartilhamento ativado',
      description: 'Seu compartilhamento de localização foi ativado com sucesso.',
      time: '1 hora atrás',
      read: true,
    },
    {
      id: '3',
      type: 'system',
      title: 'Atualização do sistema',
      description: 'Nova versão do aplicativo está disponível.',
      time: '1 dia atrás',
      read: true,
    },
    {
      id: '4',
      type: 'privacy',
      title: 'Configurações de privacidade atualizadas',
      description: 'Suas configurações de privacidade foram atualizadas conforme solicitado.',
      time: '2 dias atrás',
      read: true,
    },
    {
      id: '5',
      type: 'location',
      title: 'Alerta de zona de segurança',
      description: 'Você saiu de uma zona de segurança configurada.',
      time: '3 dias atrás',
      read: false,
    },
  ];
  
  const filteredNotifications = notifications.filter(notification => {
    if (showUnreadOnly && notification.read) {
      return false;
    }
    if (filterType && notification.type !== filterType) {
      return false;
    }
    return true;
  });
  
  const getNotificationTypeLabel = (type: string) => {
    switch(type) {
      case 'guardian': return 'Responsáveis';
      case 'location': return 'Localização';
      case 'system': return 'Sistema';
      case 'privacy': return 'Privacidade';
      default: return type;
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'guardian': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'location': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'system': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'privacy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notificações</h1>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={filterType === null}
                onCheckedChange={() => setFilterType(null)}
              >
                Todas
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterType === 'guardian'}
                onCheckedChange={() => setFilterType(filterType === 'guardian' ? null : 'guardian')}
              >
                Responsáveis
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterType === 'location'}
                onCheckedChange={() => setFilterType(filterType === 'location' ? null : 'location')}
              >
                Localização
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterType === 'system'}
                onCheckedChange={() => setFilterType(filterType === 'system' ? null : 'system')}
              >
                Sistema
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterType === 'privacy'}
                onCheckedChange={() => setFilterType(filterType === 'privacy' ? null : 'privacy')}
              >
                Privacidade
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showUnreadOnly}
                onCheckedChange={setShowUnreadOnly}
              >
                Apenas não lidas
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="sm">
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <Card 
              key={notification.id} 
              className={`${!notification.read ? 'border-l-4 border-l-monitoro-500' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${!notification.read ? 'text-monitoro-800 dark:text-monitoro-300' : ''}`}>
                        {notification.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${getNotificationColor(notification.type)}`}>
                        {getNotificationTypeLabel(notification.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                    {!notification.read && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <CheckCheck className="h-4 w-4 text-monitoro-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">Nenhuma notificação encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {filterType || showUnreadOnly 
                ? 'Tente remover alguns filtros' 
                : 'Você não tem nenhuma notificação no momento'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
