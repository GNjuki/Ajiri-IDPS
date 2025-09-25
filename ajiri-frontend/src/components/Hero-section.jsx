import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
            <span className="mr-2">🚀</span>
            AJIRI for Enterprise
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
            The fastest and most powerful{" "}
            <span className="text-blue-600">platform for intelligent</span>{" "}
            document processing
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform how your business handles document analysis and data
            extraction. Process PDFs, Word docs, Excel sheets, and images with
            AI-powered OCR and intelligent Q&A.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg rounded-lg flex items-center">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-lg flex items-center">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-8">
              Trusted by leading enterprises worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
              <div className="text-2xl font-bold">Microsoft</div>
              <div className="text-2xl font-bold">Amazon</div>
              <div className="text-2xl font-bold">Google</div>
              <div className="text-2xl font-bold">Salesforce</div>
              <div className="text-2xl font-bold">Netflix</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
