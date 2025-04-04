import { useAuth } from "../contexts/AuthContext"; // Corrected import path
import { Card, CardHeader, CardContent } from "../components/ui/card"; // Corrected import path

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Profile</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="font-medium">Email</label>
            <p>{user?.email}</p>
          </div>
          <div>
            <label className="font-medium">User ID</label>
            <p>{user?.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
