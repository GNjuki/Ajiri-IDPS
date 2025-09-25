export function StatsSection() {
  const stats = [
    {
      value: "90%",
      label: "reduction in manual data entry",
      company: "Fortune 500 Companies",
    },
    {
      value: "98%",
      label: "faster document processing",
      company: "Legal Firms",
    },
    {
      value: "300%",
      label: "increase in productivity",
      company: "Financial Services",
    },
    {
      value: "6x",
      label: "faster analysis and insights",
      company: "Healthcare Organizations",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              The complete platform to transform document workflows.
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your team's toolkit to stop manual processing and start
              innovating. Securely extract, analyze, and gain insights from any
              document format with enterprise-grade AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Get a Demo
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Explore the Platform
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-900 font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
