import { CheckCircle } from "lucide-react";

export function PlatformSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              ⚡ Collaboration
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Faster iteration. More innovation.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              The platform for rapid progress. Let your team focus on extracting
              insights instead of managing document processing infrastructure
              with automated workflows, built-in AI analysis, and integrated
              collaboration tools.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Make document processing seamless.{" "}
                <span className="text-gray-600">
                  Tools for your team and stakeholders to collaborate and
                  iterate faster.
                </span>
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Real-time Processing</div>
                  <div className="text-sm text-gray-600">
                    Instant document analysis with progress indicators
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">AI Chat Interface</div>
                  <div className="text-sm text-gray-600">
                    Ask questions about document content using natural language
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Batch Processing</div>
                  <div className="text-sm text-gray-600">
                    Handle multiple documents simultaneously for maximum
                    efficiency
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">API Integration</div>
                  <div className="text-sm text-gray-600">
                    Seamlessly integrate with your existing business systems
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
