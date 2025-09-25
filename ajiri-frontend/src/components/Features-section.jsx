import { FileText, Brain, Zap, Shield, BarChart3, Users } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Multi-Format Processing",
    description:
      "Handle PDFs, Word documents, Excel spreadsheets, PowerPoint presentations, images, and text files with intelligent extraction.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Ask questions about your documents using Claude 3.5 Sonnet. Get instant answers and insights from your content.",
  },
  {
    icon: Zap,
    title: "Advanced OCR",
    description:
      "Leverage AWS Textract for industry-leading optical character recognition with bounding box visualization.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption, secure authentication, and compliance with industry standards for data protection.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track processing history, monitor usage patterns, and gain insights into your document workflows.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Secure user management with role-based access control and collaborative document processing.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Flagship Capabilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful document processing tools designed for enterprise-scale
            operations with cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
