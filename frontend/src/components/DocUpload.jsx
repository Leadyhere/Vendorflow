import { useState, useRef } from 'react';
import { UploadCloud, FileType, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/client';

export default function DocUpload({ vendorId, docName, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type and size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    // In a real app we'd pass docName to map it accurately
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
    <div className="mt-3">
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
        className="flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            Extracting via AI...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4 mr-1.5" />
            Upload Document
          </>
        )}
      </button>
    </div>
  );
}
