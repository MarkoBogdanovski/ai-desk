import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as pdfjsLib from 'pdfjs-dist';
import { DocumentInfo, DocumentAnalysis } from '@/types/document';

export default function Sidebar({ selectedItem, documentAnalysis }: { selectedItem: File | null; documentAnalysis: DocumentAnalysis | null }) {
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo>({});

  useEffect(() => {
    if (selectedItem) {
      if (selectedItem.type === 'application/pdf') {
        parseDocument(selectedItem);
      } else if (selectedItem.type.startsWith('image/')) {
        parseImage(selectedItem);
      }
    }
  }, [selectedItem]);

  const parseDocument = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const metadata = await pdf.getMetadata();

      const info: DocumentInfo = {
        'Number of Pages': pdf.numPages,
      };

      if (metadata.info) {
        Object.entries(metadata.info).forEach(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number') {
            if ((key === 'CreationDate' || key === 'ModDate') && typeof value === 'string') {
              // Convert PDF date string to a more reliable format
              try {
                const pdfDateString = value.substring(2); // Remove 'D:' prefix
                const year = pdfDateString.substring(0, 4);
                const month = pdfDateString.substring(4, 6);
                const day = pdfDateString.substring(6, 8);
                info[key] = `${year}-${month}-${day}`;
              } catch (error) {
                console.error('Error parsing CreationDate:', error);
                info[key] = 'Invalid Date';
              }
            } else {
              info[key] = value;
            }
          }
        });
      }

      setDocumentInfo(info);

    } catch (error) {
      console.error('Error parsing PDF:', error);
    }
  };

  const parseImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const info: DocumentInfo = {
          'File Name': file.name,
          'File Type': file.type,
          'File Size': `${(file.size / 1024).toFixed(2)} KB`,
          'Dimensions': `${img.width} x ${img.height}`,
          'Last Modified': new Date(file.lastModified).toLocaleString(),
        };
        setDocumentInfo(info);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDocumentInfo((prev: DocumentInfo) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Implement save functionality here
    console.log('Saving document info:', documentInfo);
  };

  return (
    <div className="min-w-96 bg-white p-4 rounded-md shadow-md ml-4">
      <h2 className="text-xl font-semibold mb-4">File Information</h2>
      <div className="space-y-4">
        {Object.entries(documentInfo).map(([key, value]) => (
          <div key={key}>
            <Label htmlFor={key}>{key}</Label>
            <Input
              id={key}
              name={key}
              value={value as string | number}
              onChange={handleInputChange}
            />
          </div>
        ))}
        {/* <Button onClick={handleSave} className="w-full">Save</Button> */}
      </div>
    </div>
  );
}
