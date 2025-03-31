import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    origin: req.headers.get('origin')
  })

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request with headers:', corsHeaders)
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    const body = await req.json()
    console.log('Request body:', body)

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurada')
    }

    const { studentName, studentEmail, guardianName, guardianEmail, latitude, longitude, timestamp } = body

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Sistema Monitore <noreply@sistemamonitore.com.br>',
        to: guardianEmail,
        subject: `Alerta de Localização - ${studentName}`,
        html: `
          <h2>Alerta de Localização</h2>
          <p>Olá ${guardianName},</p>
          <p>Recebemos uma atualização de localização para ${studentName}.</p>
          <p><strong>Detalhes:</strong></p>
          <ul>
            <li>Data/Hora: ${new Date(timestamp).toLocaleString()}</li>
            <li>Latitude: ${latitude}</li>
            <li>Longitude: ${longitude}</li>
          </ul>
          <p>Você pode visualizar a localização no mapa através do aplicativo.</p>
        `
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Erro ao enviar e-mail: ${error.message}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  } catch (error: unknown) {
    console.error('Error processing request:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
})
