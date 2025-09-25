import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Clock, X, Eye, MessageSquare } from 'lucide-react';
import { DocumentViewer } from '../components/DocumentViewer';
import { AuthDebug } from '../components/AuthDebug';
import apiService from '../services/api';

export function DashboardUpload() {
  const [documents, setDocuments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = [...e.dataTransfer.files];
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    for (const file of files) {
      await processDocument(file);
    }
  };

  const processDocument = async (file) => {
    const tempDoc = {
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'processing',
      uploadTime: new Date().toISOString(),
      file: file
    };
    
    setDocuments(prev => [tempDoc, ...prev]);
    setProcessing(true);

    try {
      const response = await apiService.uploadDocument(file);
      
      setDocuments(prev => prev.map(doc => 
        doc.id === tempDoc.id ? {
          ...doc,
          status: 'completed',
          processingTime: response.document.processingTime,
          processingMethod: response.document.processingMethod,
          extractedText: response.extractedText,
          wordCount: response.stats.wordCount,
          characterCount: response.stats.characterCount
        } : doc
      ));
    } catch (error) {
      console.error('Document processing failed:', error);
      setDocuments(prev => prev.map(doc => 
        doc.id === tempDoc.id ? { ...doc, status: 'failed', error: error.message } : doc
      ));
    } finally {
      setProcessing(false);
    }
  };

  const handleFileInput = (e) => {
    const files = [...e.target.files];
    handleFiles(files);
  };

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Document Intelligence
        </h1>
        <p className="text-slate-600 mt-3 text-lg">
          Transform any document into searchable, analyzable text with AWS AI
        </p>
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
            AWS Textract OCR
          </div>
          <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Bedrock AI Analysis
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-12">
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer group ${
            dragActive 
              ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105' 
              : 'border-slate-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:scale-102'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Drop files here or click to upload
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Supports PDF, Word, Excel, PowerPoint, images (PNG, JPG, TIFF, BMP), and text files up to 50MB
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['PDF', 'DOCX', 'XLSX', 'PPTX', 'PNG', 'JPG', 'TXT'].map((format) => (
                <span key={format} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                  {format}
                </span>
              ))}
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
              Choose Files to Process
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.tiff,.bmp,.gif"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>

      {/* Processing Queue */}
      {documents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Processing Queue ({documents.length})
          </h2>
          <div className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-medium text-gray-900 truncate">
                        {doc.name}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {formatFileSize(doc.size)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(doc.uploadTime).toLocaleTimeString()}
                        </span>
                        {doc.processingTime && (
                          <span className="text-sm text-green-600">
                            Processed in {doc.processingTime}ms
                          </span>
                        )}
                        {doc.wordCount && (
                          <span className="text-sm text-blue-600">
                            {doc.wordCount} words extracted
                          </span>
                        )}
                      </div>
                      {doc.status === 'failed' && doc.error && (
                        <p className="text-sm text-red-600 mt-1">{doc.error}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(doc.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                      doc.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {doc.status === 'processing' ? 'Processing...' : 
                       doc.status === 'completed' ? 'Completed' : 'Failed'}
                    </span>
                    {doc.status === 'completed' && doc.extractedText && (
                      <>
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="View & Analyze"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                          title="AI Analysis"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {doc.status === 'completed' && doc.extractedText && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-900">Extracted Text Preview:</h5>
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        View Full Text & Analyze →
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {doc.extractedText.substring(0, 300)}{doc.extractedText.length > 300 ? '...' : ''}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      {doc.characterCount} characters • Ready for AI analysis
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
      
      <AuthDebug />
    </div>
  );
}