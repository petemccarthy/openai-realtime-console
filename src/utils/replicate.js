import Replicate from 'replicate';

const RELAY_SERVER = process.env.REACT_APP_LOCAL_RELAY_SERVER_URL || 'http://localhost:8081';

export async function generatePostcardImage(prompt) {
  try {
    console.log('Sending request to generate image with prompt:', prompt);
    
    const response = await fetch(`${RELAY_SERVER}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    console.log('Received response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await response.json();
      console.error('Error response:', error);
      throw new Error(error.error || 'Failed to generate image');
    }

    const text = await response.text();
    console.log('Raw response text:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid response format from server');
    }

    console.log('Parsed response data:', data);
    
    if (!data.imageUrl) {
      console.error('No imageUrl in response data:', data);
      throw new Error('No image URL in response');
    }

    console.log('Successfully extracted image URL:', data.imageUrl);
    return data.imageUrl;
  } catch (error) {
    console.error('Error in generatePostcardImage:', error);
    throw error;
  }
}
