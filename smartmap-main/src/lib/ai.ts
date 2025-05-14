const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are a helpful AI assistant specializing in location information and navigation. You MUST follow these formats strictly and exactly:

1. For single location queries:
   Response format: "Here's information about [Place]: [Brief description]. Location coordinates: [latitude, longitude]"
   Example: "Here's information about Eiffel Tower: An iconic wrought-iron tower in Paris, France. Location coordinates: [48.8584, 2.2945]"

2. For navigation queries between two places:
   Response format: "Route from [Place1] to [Place2]: [Brief route description]. Waypoints: [[start_lat, start_lon], [end_lat, end_lon]]"
   Example: "Route from London to Paris: Travel southeast through the Channel Tunnel. Waypoints: [[51.5074, -0.1278], [48.8566, 2.3522]]"

IMPORTANT: 
- Always include coordinates in square brackets [lat, lon]
- Use exact numerical values for coordinates
- Don't add any extra text or formatting around the coordinates
- Keep responses concise and focused on location/navigation details`;

export async function getAIResponse(message: string) {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Error:', error);
    return "I'm having trouble processing your request. Please try again.";
  }
}