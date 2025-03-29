
import React from 'react';
import { User, Phone, Mail, Shield, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/common/StatusBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface GuardianProps {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'pending' | 'inactive';
  type: 'primary' | 'secondary';
  avatar?: string;
}

const GuardianCard = ({ guardian }: { guardian: GuardianProps }) => {
  return (
    <Card className="card-gradient">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {guardian.avatar ? (
                <img 
                  src={guardian.avatar} 
                  alt={guardian.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{guardian.name}</h3>
                {guardian.type === 'primary' && (
                  <span className="bg-monitoro-100 text-monitoro-800 dark:bg-monitoro-900/20 dark:text-monitoro-300 text-xs px-2 py-0.5 rounded">
                    Principal
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <div className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{guardian.email}</span>
                </div>
                {guardian.phone && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{guardian.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={guardian.status} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Shield className="h-4 w-4 mr-2" />
                  Permissões
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuardianCard;
