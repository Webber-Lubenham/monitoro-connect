
import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Key, Globe, Moon, Smartphone, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-monitoro-500" />
              Notificações
            </CardTitle>
            <CardDescription>
              Gerencie como você recebe notificações do aplicativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Notificações push</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receba alertas em seu dispositivo
                </p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notificações por email</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receba um resumo diário por email
                </p>
              </div>
              <Switch id="email-notifications" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emergency-notifications">Alertas de emergência</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sons e vibração para situações de emergência
                </p>
              </div>
              <Switch id="emergency-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-monitoro-500" />
              Privacidade e Segurança
            </CardTitle>
            <CardDescription>
              Configure suas preferências de privacidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="location-history">Histórico de localização</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Armazenar histórico de localizações
                </p>
              </div>
              <Switch id="location-history" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="location-accuracy">Precisão de localização</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Compartilhar localização exata
                </p>
              </div>
              <Switch id="location-accuracy" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Autenticação em dois fatores</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Segurança adicional para sua conta
                </p>
              </div>
              <Switch id="two-factor" />
            </div>
            
            <Separator />
            
            <Button variant="outline" className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Alterar senha
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-monitoro-500" />
              Preferências
            </CardTitle>
            <CardDescription>
              Personalize sua experiência no aplicativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Modo escuro</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tema escuro para o aplicativo
                </p>
              </div>
              <Switch id="dark-mode" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="language">Idioma</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Atualmente: Português (Brasil)
                </p>
              </div>
              <Button variant="outline" size="sm">
                Alterar
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-monitoro-500" />
              Sobre o aplicativo
            </CardTitle>
            <CardDescription>
              Informações sobre o Monitoro Connect
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Versão</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">1.0.0</p>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Termos de serviço</p>
              <Button variant="link" className="h-auto p-0 text-sm text-monitoro-600">
                Ler termos
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Política de privacidade</p>
              <Link to="/privacidade">
                <Button variant="link" className="h-auto p-0 text-sm text-monitoro-600">
                  Ler política
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
