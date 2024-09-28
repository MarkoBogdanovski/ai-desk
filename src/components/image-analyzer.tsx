import { useState } from 'react';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { Button } from '@/components/ui/button';
import IconCircle from '@/components/icon-circle';
import { Image, Upload } from 'lucide-react';

export default function ImageAnalyzer({ onSelect }: { onSelect: (item: File) => void }) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { isDragging, handleDragEnter, handleDragLeave, handleDragOver } = useDragAndDrop();

  const handleDrop = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      onSelect(file);
    }
  };

  const handleUpload = () => {
    console.log("Image upload triggered");
    // Implement file input click here
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Image Selection</h2>
      <div
        className={`h-[400px] rounded-lg flex flex-col items-center justify-center border-2 border-dashed ${isDragging ? 'border-zinc-400 bg-zinc-50' : 'border-gray-300 bg-white'} transition-colors duration-300`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer.files[0];
          handleDrop(file);
        }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Selected image" className="max-h-full max-w-full object-contain" />
        ) : (
          <div className='text-center'>
            <IconCircle icon={Image} />
            <p className='mt-2 text-sm text-zinc-600'>
              {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
            </p>
          </div>
        )}
        <div className="flex justify-center mt-3">
          <Button onClick={handleUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
        </div>
      </div>
    </div>
  );
}
