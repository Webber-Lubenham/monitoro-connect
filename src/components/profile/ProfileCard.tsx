
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile } from '@/hooks/useProfile';

export interface ProfileCardProps {
  profile: Profile | null;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perfil não encontrado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Não foi possível carregar as informações do perfil.</p>
        </CardContent>
      </Card>
    );
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile.name) {
      return profile.name.split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    return profile.email?.substring(0, 2).toUpperCase() || 'A';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Meu Perfil</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile.name || 'Perfil'} />
          ) : null}
          <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold">{profile.name || profile.email}</h3>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <p className="text-sm text-gray-500 mt-1 capitalize">{profile.role || 'Estudante'}</p>
        </div>

        <div className="w-full pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <span className="text-sm text-gray-900">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Função:</span>
              <span className="text-sm text-gray-900 capitalize">{profile.role || 'Estudante'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Conta criada:</span>
              <span className="text-sm text-gray-900">
                {profile.created_at 
                  ? new Date(profile.created_at).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
