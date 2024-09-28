"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Navigation from '@/components/navigation'
import Sidebar from '@/components/sidebar'
import IconCircle from '@/components/icon-circle'
import ImageAnalyzer from '@/components/image-analyzer'
import { useDocumentUpload, useTensorflowModel, usePdfAnalysis, useDragAndDrop, useDocumentSummary } from '@/hooks';
import { DocumentAnalysis } from '@/types/document'
import { FileText, FileSearch, Mic, Upload, Square, Wand2, Loader2 } from "lucide-react"

function DocumentDropdownInput({ onSelect }: { onSelect: (item: File, analysis?: DocumentAnalysis) => void }) {
  const { selectedDocument, handleDrop } = useDocumentUpload(onSelect);
  const { isDragging, handleDragEnter, handleDragLeave, handleDragOver } = useDragAndDrop();
  const tfModel = useTensorflowModel();
  const { isAnalyzing, analyzeDocument } = usePdfAnalysis(tfModel);

  const handleFileSelect = async (file: File) => {
    if (tfModel) {
      const result = await analyzeDocument(file);
      if (result && 'analysis' in result) {
        onSelect(file, result.analysis || undefined);
      } else {
        console.error('Invalid analysis result');
        onSelect(file);
      }
    } else {
      console.error('TensorFlow model not loaded');
      onSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Document Selection</h2>
      <div
        className={`h-[400px] rounded-lg flex flex-col items-center justify-center border-2 border-dashed ${isDragging ? 'border-zinc-500 bg-zinc-50' : 'bg-white border-gray-300'} transition-colors duration-300 ${!tfModel ? 'cursor-not-allowed' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (tfModel) {
            const file = e.dataTransfer.files[0];
            handleFileSelect(file);
          }
        }}
      >
        {selectedDocument ? (
          <div className="text-center">
            <FileText className="w-16 h-16 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-600">{selectedDocument}</p>
          </div>
        ) : (
          <div className='text-center'>
            <FileText className="w-16 h-16 text-zinc-400 mx-auto mb-2" />
            <p className='mt-2 text-sm text-zinc-600'>
              {!tfModel ? 'Loading model...' : (isDragging ? 'Drop your PDF here' : 'Drag & drop your PDF here')}
            </p>
          </div>
        )}
        <div className="flex justify-center mt-3">
          <Button onClick={() => console.log("Document upload triggered")} disabled={isAnalyzing || !tfModel}>
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : !tfModel ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading model...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function DocumentSummary({ documentAnalysis, fullText }: { documentAnalysis: DocumentAnalysis | null, fullText: string }) {
  const { summary, isGenerating, generateSummary } = useDocumentSummary();

  const handleGenerateSummary = () => {
    generateSummary(documentAnalysis, fullText);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Document Summary</h2>
      <div className={`h-[400px] rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 transition-colors duration-300`}>
        {summary ? (
          <div className="px-6 overflow-auto h-full w-full">
            <p className="text-zinc-500 whitespace-pre-line">{summary}</p>
          </div>
        ) : (
          <div className="text-center">
            <IconCircle icon={FileSearch} className="mb-3" />
            <p className="mt-2 text-sm text-zinc-600 mb-4">
              {documentAnalysis && fullText
                ? 'Generate a summary of your selected document to get key insights and main points.'
                : 'Please analyze a document first before generating a summary.'}
            </p>
            <Button onClick={handleGenerateSummary} disabled={!documentAnalysis || !fullText || isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function VoiceReader({ fileDescription }: { fileDescription: string }) {
  const [voice, setVoice] = useState("voice1")
  const [speed, setSpeed] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [isReading, setIsReading] = useState(false)

  const handleStartReading = () => {
    // Implement text-to-speech functionality here
    setIsReading(true)
    console.log("Start reading:", fileDescription)
  }

  const handleStopReading = () => {
    // Implement stop reading functionality here
    setIsReading(false)
    console.log("Stop reading")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Voice Reader</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Voice</label>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="voice1">Voice 1</SelectItem>
              <SelectItem value="voice2">Voice 2</SelectItem>
              <SelectItem value="voice3">Voice 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Speed: {speed.toFixed(1)}x</label>
          <Slider
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            min={0.5}
            max={2}
            step={0.1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pitch: {pitch.toFixed(1)}</label>
          <Slider
            value={[pitch]}
            onValueChange={(value) => setPitch(value[0])}
            min={0.5}
            max={2}
            step={0.1}
          />
        </div>
        <Button className="w-full" onClick={isReading ? handleStopReading : handleStartReading}>
          {isReading ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Stop Reading
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Reading
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [selectedItem, setSelectedItem] = useState<File | null>(null);
  const [documentAnalysis, setDocumentAnalysis] = useState<DocumentAnalysis | null>(null);
  const [fullText, setFullText] = useState<string>('');
  const [activeTab, setActiveTab] = useState("image");
  const [fileDescription, setFileDescription] = useState("");

  const { isAnalyzing, analyzeDocument } = usePdfAnalysis(useTensorflowModel());

  const handleDocumentSelect = async (file: File) => {
    setSelectedItem(file);
    const result = await analyzeDocument(file);
    if (result && result.analysis) {
      setDocumentAnalysis(result.analysis);
      setFullText(result.fullText);
      setFileDescription(`This is a PDF document named ${result.analysis.fileName}. It has ${result.analysis.pageCount} pages and a text complexity of ${result.analysis.textComplexity}. The document contains approximately ${result.analysis.wordCount} words with an average word length of ${result.analysis.averageWordLength.toFixed(2)} characters.`);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      const description = selectedItem.type.startsWith('image/')
        ? `This is an image file named ${selectedItem.name}. It has a size of ${(selectedItem.size / 1024).toFixed(2)} KB.`
        : `This is a document file named ${selectedItem.name}. It has a size of ${(selectedItem.size / 1024).toFixed(2)} KB.`
      setFileDescription(description)
    } else {
      setFileDescription("")
    }
  }, [selectedItem])

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Only reset selectedItem and documentAnalysis when switching to the image or document tab
    if (value === "image" || value === "document") {
      setSelectedItem(null);
      setDocumentAnalysis(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="container max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="flex flex-col lg:flex-row">
          <div className="flex-grow mr-3">
            <div className="space-y-4">
              <Navigation activeTab={activeTab} setActiveTab={handleTabChange} />
              <div className="bg-white p-6 rounded-lg shadow-md">
                {activeTab === "image" && <ImageAnalyzer onSelect={setSelectedItem} />}
                {activeTab === "document" && <DocumentDropdownInput onSelect={handleDocumentSelect} />}
                {activeTab === "summary" && <DocumentSummary documentAnalysis={documentAnalysis} fullText={fullText} />}
                {activeTab === "voice" && <VoiceReader fileDescription={fileDescription} />}
              </div>
            </div>
          </div>
          <Sidebar selectedItem={selectedItem} documentAnalysis={documentAnalysis} />
        </div>
      </div>
    </div>
  )
}
