import { useState, useRef } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import api from '../api/client';

export default function DocUpload({ vendorId, docName, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_name', docName);

    try {
      const res = await api.post(`/api/vendors/${vendorId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.status === 'uploaded') {
        onUploadSuccess();
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-4 sm:mt-0">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg"
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center text-sm font-bold text-primary-400 hover:text-white bg-dark-800 hover:bg-dark-700 border border-dark-700 px-4 py-2 rounded-full transition-all disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Extracting...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload
          </>
        )}
      </button>
    </div>
  );
}
