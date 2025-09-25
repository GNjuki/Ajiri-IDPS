import { Link } from "react-router-dom";
import { FileText, Code, Zap, Shield } from "lucide-react";

export function Documentation() {
  const sections = [
    {
      icon: FileText,
      title: "Getting Started",
      description: "Learn the basics of AJIRI document processing",
      links: [
        "Quick Start Guide",
        "Account Setup",
        "First Document Upload",
        "Understanding Results"
      ]
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Complete API documentation for developers",
      links: [
        "Authentication",
        "Document Upload API",
        "Processing Status",
        "Results Retrieval"
      ]
    },
    {
      icon: Zap,
      title: "Features Guide",
      description: "Detailed guides for all AJIRI features",
      links: [
        "OCR Processing",
        "AI Chat Interface",
        "Batch Processing",
        "Export Options"
      ]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Security features and compliance information",
      links: [
        "Data Encryption",
        "Privacy Policy",
        "GDPR Compliance",
        "SOC 2 Certification"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about using AJIRI for intelligent document processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <section.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@ajiri.com" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Contact Support
            </a>
            <Link to="/register" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}