import React, { useState } from 'react';
import { usePostcards, Postcard } from '../hooks/usePostcards';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { useUser } from "@clerk/clerk-react";

interface PostcardListProps {
  onPostcardsChange?: (postcards: Postcard[]) => void;
  onPostcardClick?: (postcard: Postcard) => void;
  client?: RealtimeClient;
  isConnected?: boolean;
}

interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
}

export const PostcardList: React.FC<PostcardListProps> = ({ 
  onPostcardsChange, 
  onPostcardClick, 
  client,
  isConnected 
}) => {
  const { loading, error, postcards } = usePostcards();
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const { user } = useUser();

  // Notify parent of postcard changes
  React.useEffect(() => {
    console.log('Postcards updated:', postcards);
    onPostcardsChange?.(postcards);
  }, [postcards, onPostcardsChange]);

  const getCoordinates = async (location: string): Promise<GeocodingResult | null> => {
    try {
      const encodedLocation = encodeURIComponent(location);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch coordinates');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting coordinates:', error);
      setGeocodingError('Failed to get location coordinates');
      return null;
    }
  };

  const handlePostcardClick = async (postcard: Postcard) => {
    if (!client || !isConnected) {
      console.log('Client not connected. Please connect first.');
      return;
    }

    setGeocodingError(null);
    
    // Get coordinates for the location
    const coordinates = await getCoordinates(postcard.location);
    if (!coordinates) {
      setGeocodingError(`Could not find coordinates for ${postcard.location}`);
      return;
    }

    // Call get_weather with the actual location coordinates
    client.sendUserMessageContent([
      {
        type: 'input_text',
        text: `get_weather(lat: ${coordinates.lat}, lng: ${coordinates.lon}, location: "${postcard.location}")`,
      },
    ]);
    
    // Also notify parent if callback provided
    onPostcardClick?.(postcard);
  };

  if (loading) return null;
  if (error) return null;

  return (
    <div className="content-block postcards">
      <div className="content-block-body">
        <div className="postcards-grid">
          {postcards.map((postcard) => {
            const isCurrentUser = user?.id === postcard.user_id;
            
            return (
              <div
                key={postcard.id}
                className="postcard-item"
                onClick={() => handlePostcardClick(postcard)}
                style={{ cursor: isConnected ? 'pointer' : 'not-allowed' }}
              >
                <div className="postcard-header">
                  {isCurrentUser && (
                    <img 
                      src={user.imageUrl} 
                      alt="Your avatar"
                      className="user-avatar"
                    />
                  )}
                  <div className="location">{postcard.location}</div>
                </div>
                {postcard.image_url && (
                  <img 
                    src={postcard.image_url} 
                    alt={`Postcard from ${postcard.location}`}
                    className="postcard-image" 
                  />
                )}
                {postcard.blurb && (
                  <div className="blurb">{postcard.blurb}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {geocodingError && (
        <div className="error-message" style={{ margin: '8px', color: 'red' }}>
          {geocodingError}
        </div>
      )}
    </div>
  );
};
