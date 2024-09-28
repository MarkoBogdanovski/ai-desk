import { useState, useCallback } from 'react';
import { DocumentAnalysis } from '@/types/document';

interface DocumentUploadHook {
  selectedDocument: string | null;
  handleSelect: (value: string) => void;
  handleDrop: (file: File) => void;
}

export function useDocumentUpload(onSelect: (item: File, analysis?: DocumentAnalysis) => void): DocumentUploadHook {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const handleSelect = useCallback((value: string): void => {
    setSelectedDocument(value);
    const dummyFile: File = new File([""], value, { type: "application/pdf" });
    onSelect(dummyFile);
  }, [onSelect]);

  const handleDrop = useCallback((file: File): void => {
    if (file.type === 'application/pdf') {
      setSelectedDocument(file.name);
      onSelect(file);
    }
  }, [onSelect]);

  return { selectedDocument, handleSelect, handleDrop };
}
