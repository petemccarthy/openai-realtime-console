import React, { useEffect, useState } from 'react';
import { usePostcards, Postcard } from '../hooks/usePostcards';

export const PostcardList: React.FC = () => {
  const { loading, error, getPostcards, createPostcard, deletePostcard } = usePostcards();
  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    loadPostcards();
  }, []);

  const loadPostcards = async () => {
    const data = await getPostcards();
    setPostcards(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage || !newImageUrl) return;

    const postcard = await createPostcard({
      message: newMessage,
      image_url: newImageUrl
    });

    if (postcard) {
      setPostcards([postcard, ...postcards]);
      setNewMessage('');
      setNewImageUrl('');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deletePostcard(id);
    if (success) {
      setPostcards(postcards.filter(p => p.id !== id));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter message"
        />
        <input
          type="text"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL"
        />
        <button type="submit">Create Postcard</button>
      </form>

      <div>
        {postcards.map((postcard) => (
          <div key={postcard.id} style={{ marginBottom: '1rem' }}>
            <img src={postcard.image_url} alt="Postcard" style={{ maxWidth: '200px' }} />
            <p>{postcard.message}</p>
            <button onClick={() => handleDelete(postcard.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};
