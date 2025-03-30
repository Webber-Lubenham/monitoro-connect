
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccuracyInfo } from './notifications/AccuracyInfo';
import { LocationError } from './notifications/LocationError';
import { NotificationActions } from './notifications/NotificationActions';
import { StatusMessages } from './notifications/StatusMessages';
import { useNotificationLogic } from './notifications/useNotificationLogic';
import { Guardian } from '@/types/database.types';

export interface StudentProfileNotificationsProps {
  guardians: Guardian[];
}

export const StudentProfileNotifications = ({ guardians }: StudentProfileNotificationsProps) => {
  const {
    loading,
    location,
    accuracy,
    locationError,
    showLowAccuracyWarning,
    handleNotifyByEmail,
    handleUpdateLocation,
  } = useNotificationLogic(guardians);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Envie notificações para seus responsáveis cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LocationError error={locationError} />
        
        <AccuracyInfo 
          accuracy={accuracy} 
          showWarning={showLowAccuracyWarning} 
        />
        
        <NotificationActions
          onNotify={handleNotifyByEmail}
          onUpdateLocation={handleUpdateLocation}
          loading={loading}
          locationAvailable={!!location}
          guardiansAvailable={guardians.length > 0}
        />
        
        <StatusMessages
          guardians={guardians}
          location={location}
          locationError={locationError}
        />
      </CardContent>
    </Card>
  );
};

export default StudentProfileNotifications;
