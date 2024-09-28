import { useState } from 'react';
import { DocumentAnalysis } from '@/types/document';

function extractKeywords(text: string, count: number = 10): string[] {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq: { [key: string]: number } = {};
  words.forEach(word => {
    if (word.length > 3) { // Ignore short words
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}

function identifyMainTopic(keywords: string[]): string {
  // This is a simplified approach. In a real-world scenario, you'd use more sophisticated NLP techniques.
  return keywords[0];
}

function extractNamedEntities(text: string): string[] {
  // This is a placeholder. In a real implementation, you'd use an NLP library for named entity recognition.
  const potentialEntities = text.match(/[A-Z][a-z]+ (?:[A-Z][a-z]+ ?)*/g) || [];
  return Array.from(new Set(potentialEntities)).slice(0, 5); // Return up to 5 unique entities
}

export function useDocumentSummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateSummary = async (documentAnalysis: DocumentAnalysis | null, fullText: string): Promise<void> => {
    setIsGenerating(true);
    try {
      if (!documentAnalysis || !fullText) {
        throw new Error('No document analysis or full text available');
      }

      const keywords = extractKeywords(fullText);
      const mainTopic = identifyMainTopic(keywords);
      const namedEntities = extractNamedEntities(fullText);

      // Extract first and last paragraphs
      const paragraphs = fullText.split(/\n\s*\n/);
      const firstParagraph = paragraphs[0].trim();
      const lastParagraph = paragraphs[paragraphs.length - 1].trim();

      const generatedSummary: string = `
        Document: ${documentAnalysis.fileName}
        Pages: ${documentAnalysis.pageCount}
        Complexity: ${documentAnalysis.textComplexity}
        Word Count: ${documentAnalysis.wordCount}

        Content Description:
        This document appears to be about ${mainTopic}. It discusses topics related to ${keywords.slice(1, 5).join(', ')}, among others.

        The document begins with:
        "${firstParagraph.slice(0, 200)}..."

        Key points or entities mentioned include: ${namedEntities.join(', ')}.

        The document concludes with:
        "...${lastParagraph.slice(-200)}"

        Overall, this ${documentAnalysis.textComplexity.toLowerCase()}-complexity document contains ${documentAnalysis.wordCount} words across ${documentAnalysis.pageCount} pages, with an average word length of ${documentAnalysis.averageWordLength.toFixed(2)} characters.

        Key topics: ${keywords.join(', ')}
      `;

      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return { summary, isGenerating, generateSummary };
}
