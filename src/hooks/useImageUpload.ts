import { useState, useCallback } from 'react';

export function useImageUpload(onSelect: (item: File) => void): {
  selectedImage: string | null;
  previewUrl: string | null;
  handleSelect: (value: string) => void;
  handleDrop: (file: File) => void;
} {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSelect = useCallback((value: string): void => {
    setSelectedImage(value);
    setPreviewUrl(`/placeholder.svg?text=${value}`);
    const dummyFile: File = new File([""], value, { type: "image/png" });
    onSelect(dummyFile);
  }, [onSelect]);

  const handleDrop = useCallback((file: File): void => {
    if (file.type.startsWith('image/')) {
      setSelectedImage(file.name);
      onSelect(file);
      const reader: FileReader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>): void => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onSelect]);

  return { selectedImage, previewUrl, handleSelect, handleDrop };
}
