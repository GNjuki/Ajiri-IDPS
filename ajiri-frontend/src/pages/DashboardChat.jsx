export function DashboardChat() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Chat</h1>
        <p className="text-gray-600 mt-2">
          Ask questions about your processed documents
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">AI Chat Coming Soon</h3>
        <p className="text-gray-500">
          This feature will allow you to ask questions about your processed documents using AI.
        </p>
      </div>
    </div>
  );
}