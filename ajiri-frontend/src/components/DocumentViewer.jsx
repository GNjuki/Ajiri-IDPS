import { useState } from 'react';
import { Copy, MessageSquare, Download, Eye, EyeOff, Clock } from 'lucide-react';
import apiService from '../services/api';

export function DocumentViewer({ document, onClose }) {
  const [activeTab, setActiveTab] = useState('text');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [conversation, setConversation] = useState([]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(document.extractedText);
    alert('Text copied to clipboard!');
  };

  const handleDownloadText = () => {
    const blob = new Blob([document.extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${document.name.replace(/\.[^/.]+$/, '')}_extracted.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    const currentQuestion = question;
    setAskingQuestion(true);
    setQuestion('');
    
    try {
      const response = await apiService.askQuestion(
        currentQuestion,
        document.extractedText,
        document.name,
        `session_${document.id}`
      );
      
      const newConversation = {
        id: Date.now(),
        question: currentQuestion,
        answer: response.answer,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setConversationHistory(prev => [newConversation, ...prev]);
      setAnswer(response.answer);
    } catch (error) {
      const errorAnswer = 'Sorry, I encountered an error while processing your question.';
      const newConversation = {
        id: Date.now(),
        question: currentQuestion,
        answer: errorAnswer,
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      
      setConversationHistory(prev => [newConversation, ...prev]);
      setAnswer(errorAnswer);
    } finally {
      setAskingQuestion(false);
    }
  };

  const quickQuestions = [
    'What is this document about?',
    'Summarize the key points',
    'What are the main dates mentioned?',
    'Extract any important numbers or amounts'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{document.name}</h2>
            <p className="text-sm text-gray-500">
              {document.wordCount} words • Processed in {document.processingTime}ms
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('text')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'text'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Extracted Text
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ai'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              AI Analysis
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Conversation ({conversationHistory.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'text' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Extracted Text</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowFullText(!showFullText)}
                    className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    {showFullText ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {showFullText ? 'Collapse' : 'Expand'}
                  </button>
                  <button
                    onClick={handleCopyText}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Text
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className={`whitespace-pre-wrap text-sm text-gray-800 ${
                  showFullText ? '' : 'max-h-96 overflow-hidden'
                }`}>
                  {document.extractedText}
                </pre>
                {!showFullText && document.extractedText.length > 1000 && (
                  <div className="mt-2 text-center">
                    <button
                      onClick={() => setShowFullText(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Show more...
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">AI Analysis</h3>
              
              {/* Quick Questions */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => setQuestion(q)}
                      className="text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Input */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about this document..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={askingQuestion || !question.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {askingQuestion ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Answer */}
              {answer && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">AI Response:</h4>
                  <p className="text-blue-800 whitespace-pre-wrap">{answer}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation History</h3>
              
              {conversationHistory.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400">Ask a question in the AI Analysis tab to start</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {conversationHistory.map((conv) => (
                    <div key={conv.id} className="border border-gray-200 rounded-lg p-4">
                      {/* Question */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                            Question
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {conv.timestamp}
                            </span>
                            <button
                              onClick={() => handleCopyToClipboard(conv.question)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Copy question"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-blue-800 text-sm">{conv.question}</p>
                        </div>
                      </div>
                      
                      {/* Answer */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-medium flex items-center ${
                            conv.isError ? 'text-red-700' : 'text-gray-900'
                          }`}>
                            <MessageSquare className={`w-4 h-4 mr-2 ${
                              conv.isError ? 'text-red-500' : 'text-green-500'
                            }`} />
                            AI Response
                          </h4>
                          <button
                            onClick={() => handleCopyToClipboard(conv.answer)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Copy response"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className={`rounded-lg p-3 ${
                          conv.isError ? 'bg-red-50' : 'bg-green-50'
                        }`}>
                          <p className={`text-sm whitespace-pre-wrap ${
                            conv.isError ? 'text-red-800' : 'text-green-800'
                          }`}>
                            {conv.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Processing method: {document.processingMethod || 'AWS Textract OCR'}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleDownloadText}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Text
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}