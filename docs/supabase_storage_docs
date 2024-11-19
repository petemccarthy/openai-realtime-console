I'll help convert the Supabase Storage documentation into organized markdown format:

# Supabase Storage Guide

## Core Concepts

### Basic Components
1. **Files**
   - Can be any media file (images, GIFs, videos)
   - Best stored outside database due to size
   - HTML files are returned as plain text
   
2. **Folders**
   - Organize files like on your computer
   - Flexible organization structure
   
3. **Buckets**
   - Containers for files and folders
   - Like "super folders"
   - Used for different security and access rules
   - Example: separate buckets for "video" and "avatar"

> **Note**: File, folder, and bucket names must follow AWS object key naming guidelines.

## Basic Operations

### Create a Bucket
```javascript
const { data, error } = await supabase.storage
  .createBucket('avatars', {
    public: true,  // default: false
    allowedMimeTypes: ['image/*'],
    fileSizeLimit: '1MB'
  })
```

### Upload a File
```javascript
const avatarFile = event.target.files[0]
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar1.png', avatarFile)
```

### Download a File
```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .download('public/avatar1.png')
```

## Access Control Models

### Private Buckets (Default)
- All operations subject to RLS policies
- Access requires:
  1. Download method with authorization header (JWT)
  2. Signed URL with time limit
- Use cases:
  - Sensitive documents
  - Access-controlled assets

### Public Buckets
- Bypasses access controls for retrieving/serving files
- Still enforces access control for:
  - Uploading
  - Deleting
  - Moving
  - Copying
- Use cases:
  - Profile pictures
  - Public media
  - Blog content
- Better performance due to different caching

## Security Policies

### Example RLS Policies

1. Basic Insert Policy:
```sql
create policy "policy_name"
ON storage.objects
for insert with check (
  true
);
```

2. Authenticated Users Upload:
```sql
create policy "policy_name"
on storage.objects for insert to authenticated with check (
  bucket_id = 'my_bucket_id'
);
```

3. User-Specific Folder Access:
```sql
create policy "Allow authenticated uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'my_bucket_id' and
  (storage.foldername(name))[1] = (select auth.uid()::text)
);
```

## File Transformations

### Image Optimization
```javascript
const { data } = await supabase.storage
  .from('bucket')
  .getPublicUrl('image.jpg', {
    transform: {
      width: 500,
      height: 600,
      quality: 80
    },
  })
```

### Next.js Integration
```javascript
// supabase-image-loader.js
const projectId = 'your-project-id'

export default function supabaseLoader({ src, width, quality }) {
  return `https://${projectId}.supabase.co/storage/v1/render/image/public/${src}?width=${width}&quality=${quality || 75}`
}
```

# Advanced Supabase Storage Features

## File Upload Options

### Standard Upload (< 6MB)
```javascript
const { data, error } = await supabase.storage
  .from('bucket_name')
  .upload('file_path', file)
```

### File Overwriting
```javascript
// Enable overwriting existing files
const { data, error } = await supabase.storage
  .from('bucket_name')
  .upload('file_path', file, {
    upsert: true,
    contentType: 'image/jpeg' // Optional content type specification
  })
```

## Ownership and Access Control

### Setting Up Ownership
```sql
-- Example policy: Users can only delete their own objects
create policy "User can delete their own objects"
on storage.objects
for delete
to authenticated
using (
  owner_id = (select auth.uid())
);
```

## Bucket Management

### Creating Restricted Buckets
```javascript
const { data, error } = await supabase.storage
  .createBucket('avatars', {
    public: false,
    allowedMimeTypes: ['image/*'],
    fileSizeLimit: '1MB',
  })
```

### Advanced Access Policies

1. **Folder-Specific Access**:
```sql
create policy "Private folder access"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'my_bucket' and
  (storage.foldername(name))[1] = 'private'
);
```

2. **User-Specific Folders**:
```sql
create policy "User folder access"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'user_files' and
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Advanced Image Transformations

### Resize Options
```javascript
// Cover mode (default)
const { data: coverImage } = await supabase.storage
  .from('images')
  .download('image.jpg', {
    transform: {
      width: 800,
      height: 300,
      resize: 'cover'
    }
  })

// Contain mode
const { data: containImage } = await supabase.storage
  .from('images')
  .download('image.jpg', {
    transform: {
      width: 800,
      height: 300,
      resize: 'contain'
    }
  })

// Fill mode
const { data: fillImage } = await supabase.storage
  .from('images')
  .download('image.jpg', {
    transform: {
      width: 800,
      height: 300,
      resize: 'fill'
    }
  })
```

### Format Control
```javascript
// Force original format
const { data } = await supabase.storage
  .from('bucket')
  .download('image.jpeg', {
    transform: {
      width: 200,
      height: 200,
      format: 'origin',
    }
  })
```

## Error Handling and Validation

```javascript
async function uploadWithValidation(file) {
  // Size validation
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('File too large')
  }

  // Type validation
  const ALLOWED_TYPES = ['image/jpeg', 'image/png']
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  try {
    const { data, error } = await supabase.storage
      .from('bucket')
      .upload(`files/${file.name}`, file)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error:', error.message)
    throw error
  }
}
```

## File Management Functions

```javascript
// List files in a bucket
async function listFiles(bucketName, folderPath = '') {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folderPath)
  
  if (error) throw error
  return data
}

// Move/Copy files
async function moveFile(bucket, oldPath, newPath) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .move(oldPath, newPath)
  
  if (error) throw error
  return data
}

// Remove files
async function removeFile(bucket, path) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) throw error
  return data
}
```

## Signed URLs

```javascript
// Create temporary access URL
async function getTemporaryUrl(bucket, filePath, expirySeconds = 60) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expirySeconds, {
      transform: {
        width: 200,
        height: 200
      }
    })
  
  if (error) throw error
  return data.signedUrl
}
```

## React Integration Example

```javascript
function FileUploader() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload() {
    try {
      setUploading(true)

      if (!file) throw new Error('You must select a file to upload.')

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(`${Date.now()}-${file.name}`, file)

      if (error) throw error
      
      alert('File uploaded successfully!')
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        disabled={uploading}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  )
}
```

