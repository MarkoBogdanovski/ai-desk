
export interface DocumentInfo {
  [key: string]: string | number;
}

export interface DocumentAnalysis {
  fileName: string;
  fileSize: string;
  pageCount: number;
  creationDate: string;
  textComplexity: string;
  wordCount: number;
  averageWordLength: number;
}
