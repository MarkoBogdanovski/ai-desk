import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { UniversalSentenceEncoder } from '@tensorflow-models/universal-sentence-encoder';
import { DocumentAnalysis } from '@/types/document';

export function usePdfAnalysis(tfModel: UniversalSentenceEncoder | null) {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  const analyzeDocument = async (file: File): Promise<{ analysis: DocumentAnalysis | null; fullText: string }> => {
    setIsAnalyzing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const metadata = await pdf.getMetadata();

      const info: DocumentAnalysis = {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        pageCount: pdf.numPages,
        creationDate: '',
        textComplexity: '',
        wordCount: 0,
        averageWordLength: 0,
      };

      if (metadata.info && 'CreationDate' in metadata.info) {
        const creationDate = metadata.info.CreationDate;
        if (typeof creationDate === 'string') {
          const pdfDateString = creationDate.substring(2); // Remove 'D:' prefix
          const year = pdfDateString.substring(0, 4);
          const month = pdfDateString.substring(4, 6);
          const day = pdfDateString.substring(6, 8);
          info.creationDate = `${year}-${month}-${day}`;
        }
      }

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item) => ('str' in item ? item.str : '')).join(' ') + ' ';
      }

      if (tfModel) {
        const embeddings = await tfModel.embed([fullText]);
        const embeddingArray = await embeddings.array();

        if (embeddingArray && embeddingArray.length > 0) {
          const avgEmbedding = embeddingArray[0].reduce((sum: number, val: number) => sum + val, 0) / embeddingArray[0].length;
          let complexity: 'Simple' | 'Medium' | 'Complex' = 'Medium';
          if (avgEmbedding < 0.3) complexity = 'Simple';
          else if (avgEmbedding > 0.7) complexity = 'Complex';
          info.textComplexity = complexity;
        } else {
          info.textComplexity = 'Unable to determine';
        }

        info.wordCount = fullText.split(/\s+/).length;
        info.averageWordLength = fullText.length / fullText.split(/\s+/).length;
      } else {
        info.textComplexity = 'Model not loaded';
      }

      return { analysis: info, fullText };
    } catch (error) {
      console.error('Error analyzing PDF:', error);
      return { analysis: null, fullText: '' };
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { isAnalyzing, analyzeDocument };
}
