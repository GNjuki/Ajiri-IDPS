export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold">AJIRI</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Intelligent document processing powered by cutting-edge AI technology. Transform your business workflows
              with enterprise-grade automation.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/platform" className="text-gray-600 hover:text-gray-900 transition-colors">Platform Overview</a></li>
              <li><a href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a></li>
              <li><a href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a></li>
              <li><a href="/security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</a></li>
              <li><a href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</a></li>
              <li><a href="/guides" className="text-gray-600 hover:text-gray-900 transition-colors">Guides</a></li>
              <li><a href="/api" className="text-gray-600 hover:text-gray-900 transition-colors">API Reference</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
              <li><a href="/careers" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© 2025 AJIRI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
            <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
            <a href="/cookies" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
