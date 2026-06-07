import { useState, useRef } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { uploadProductImage } from '@/lib/upload';

interface ImageData {
  url: string;
  alt: string;
}

interface ImageUploadProps {
  images: ImageData[];
  onChange: (images: ImageData[]) => void;
  disabled?: boolean;
}

export function ImageUpload({ images, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    const results: ImageData[] = [];
    for (const file of files) {
      try {
        const uploaded = await uploadProductImage(file);
        results.push(uploaded);
      } catch {
        // Skip failed uploads
      }
    }
    onChange([...images, ...results]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-border group">
            <img src={img.url} alt={img.alt || ''} className="h-full w-full object-cover" />
            {!disabled && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        {!disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-20 w-20 rounded-lg border-2 border-dashed border-border hover:border-accent/50 transition-colors grid place-items-center text-muted-foreground hover:text-accent"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}
