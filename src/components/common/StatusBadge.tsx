
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'active' | 'inactive' | 'pending' | 'error';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig = {
  active: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-400',
    dot: 'bg-green-500',
    defaultLabel: 'Ativo'
  },
  inactive: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-400',
    dot: 'bg-gray-500',
    defaultLabel: 'Inativo'
  },
  pending: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-800 dark:text-yellow-400',
    dot: 'bg-yellow-500',
    defaultLabel: 'Pendente'
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-400',
    dot: 'bg-red-500',
    defaultLabel: 'Erro'
  }
};

const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', config.dot)}></span>
      {label || config.defaultLabel}
    </span>
  );
};

export default StatusBadge;
