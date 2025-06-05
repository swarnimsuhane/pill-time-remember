import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageBase64 } = await req.json()
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const googleVisionApiKey = Deno.env.get('GOOGLE_VISION_API_KEY')
    
    if (!googleVisionApiKey) {
      return new Response(
        JSON.stringify({ error: 'Google Vision API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call Google Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${googleVisionApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: imageBase64.split(',')[1] // Remove data:image/jpeg;base64, prefix
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 10
                }
              ]
            }
          ]
        })
      }
    )

    const visionData = await visionResponse.json()
    
    if (visionData.responses && visionData.responses[0] && visionData.responses[0].textAnnotations) {
      const detectedText = visionData.responses[0].textAnnotations[0]?.description || ''
      
      // Extract medicine information from detected text
      const extractedInfo = extractMedicineInfo(detectedText)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          detectedText,
          extractedInfo 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No text detected in image' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process image' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function extractMedicineInfo(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  let medicineName = ''
  let dosage = ''
  
  // Common patterns for medicine names (usually first few lines)
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i]
    // Skip very short lines or lines with only numbers
    if (line.length > 3 && !/^\d+$/.test(line)) {
      medicineName = line
      break
    }
  }
  
  // Look for dosage patterns (mg, ml, tablets, etc.)
  const dosagePatterns = [
    /(\d+\s*(mg|ml|g|mcg|units?))/i,
    /(\d+\s*(tablet|capsule|pill)s?)/i,
    /(\d+\s*x\s*\d+\s*(mg|ml|g))/i
  ]
  
  for (const line of lines) {
    for (const pattern of dosagePatterns) {
      const match = line.match(pattern)
      if (match) {
        dosage = match[0]
        break
      }
    }
    if (dosage) break
  }
  
  return {
    name: medicineName,
    dosage: dosage,
    rawText: text
  }
}