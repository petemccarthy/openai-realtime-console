import React from 'react';
import { usePostcards, Postcard } from '../hooks/usePostcards';

interface PostcardListProps {
  onPostcardsChange?: (postcards: Postcard[]) => void;
  onPostcardClick?: (postcard: Postcard) => void;
}

export const PostcardList: React.FC<PostcardListProps> = ({ onPostcardsChange, onPostcardClick }) => {
  const { loading, error, postcards, deletePostcard } = usePostcards();

  // Notify parent of postcard changes
  React.useEffect(() => {
    console.log('Postcards updated:', postcards);
    onPostcardsChange?.(postcards);
  }, [postcards, onPostcardsChange]);

  const handleDelete = async (id: string) => {
    console.log('Deleting postcard:', id);
    const success = await deletePostcard(id);
    if (success) {
      console.log('Postcard deleted successfully');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="content-block postcards">
      <div className="content-block-title">postcards</div>
      <div className="content-block-body">
        <div className="postcards-grid">
          {postcards.map((postcard, index) => (
            <div
              key={index}
              className="postcard-item"
              onClick={() => onPostcardClick?.(postcard)}
            >
              {postcard.image_url && (
                <img src={postcard.image_url} alt={postcard.message} />
              )}
              <div className="postcard-info">
                <div className="location">{postcard.message}</div>
                {postcard.blurb && (
                  <div className="blurb">{postcard.blurb}</div>
                )}
                <button 
                  onClick={() => handleDelete(postcard.id)}
                  style={{
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    marginTop: 'auto'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
