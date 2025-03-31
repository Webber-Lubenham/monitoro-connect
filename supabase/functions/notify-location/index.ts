
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Check if required environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

// Create supabase client with error handling
const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  { 
    auth: { 
      persistSession: false 
    }
  }
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LocationUpdate {
  studentId: string
  latitude: number
  longitude: number
  timestamp: string
  status?: 'in_class' | 'in_transit' | 'unknown'
  accuracy?: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request body with error handling
    let requestData: LocationUpdate
    try {
      requestData = await req.json()
    } catch (parseError) {
      console.error('Error parsing request JSON:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { studentId, latitude, longitude, timestamp, status = 'unknown', accuracy = 0 } = requestData

    // Validate required fields
    if (!studentId || typeof latitude !== 'number' || typeof longitude !== 'number' || !timestamp) {
      console.error('Missing required fields:', { studentId, latitude, longitude, timestamp })
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Processing location update for student:', studentId)

    // Store location update
    const { error: insertError } = await supabase
      .from('location_updates')
      .insert({
        student_id: studentId,
        latitude,
        longitude,
        timestamp,
        status,
        accuracy
      })

    if (insertError) {
      console.error('Error inserting location:', insertError)
      return new Response(
        JSON.stringify({ error: `Database error: ${insertError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Fetch student's guardians notification preferences
    const { data: preferences, error: prefError } = await supabase
      .from('parent_notification_preferences')
      .select('*')
      .eq('student_id', studentId)
    
    if (prefError) {
      console.error('Error fetching preferences:', prefError)
      // Continue despite error - we'll just not notify anyone
    }

    // Get student details
    const { data: student, error: studentError } = await supabase
      .from('children')
      .select('name')
      .eq('id', studentId)
      .single()

    if (studentError) {
      console.error('Error fetching student:', studentError)
      // Continue despite error - we'll use a generic message
    }

    const studentName = student?.name || 'Aluno'

    // Process notifications for each guardian
    let notificationsCreated = 0
    if (preferences && preferences.length > 0) {
      for (const pref of preferences) {
        try {
          // Create notification record
          const { error: notifError } = await supabase
            .from('notifications')
            .insert({
              user_id: pref.parent_id,
              student_id: studentId,
              title: 'Atualização de Localização',
              message: `${studentName} está ${status === 'in_class' ? 'na escola' : 'em trânsito'}`,
              type: 'location_update',
              metadata: {
                latitude,
                longitude,
                status,
                accuracy
              }
            })

          if (notifError) {
            console.error(`Error creating notification for guardian ${pref.parent_id}:`, notifError)
          } else {
            notificationsCreated++
            console.log(`Notification created for guardian ${pref.parent_id}`)
          }
        } catch (error) {
          console.error(`Exception in notification creation for guardian ${pref.parent_id}:`, error)
        }
      }
    } else {
      console.log('No notification preferences found for student:', studentId)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        notificationsCreated,
        location: {
          latitude,
          longitude,
          timestamp,
          status,
          accuracy
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Unhandled error in notify-location function:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
