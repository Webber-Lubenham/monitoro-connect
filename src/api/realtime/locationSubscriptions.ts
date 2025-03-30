import { realtimeClient } from './realtimeClient.ts'

interface LocationUpdate {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: string
}

export const subscribeToLocationUpdates = (
  studentId: string,
  callback: (location: LocationUpdate) => void
) => {
  const subscription = realtimeClient
    .channel('location-updates')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'location_updates',
        filter: `student_id=eq.${studentId}`
      },
      (payload) => {
        const location = payload.new as LocationUpdate
        callback(location)
      }
    )
    .subscribe()

  return subscription
}

export const unsubscribeFromLocationUpdates = (
  subscription: ReturnType<typeof subscribeToLocationUpdates>
) => {
  subscription.unsubscribe()
}
