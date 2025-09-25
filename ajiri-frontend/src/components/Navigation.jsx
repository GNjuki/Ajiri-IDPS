import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut } from "lucide-react";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AJIRI</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {isAuthenticated && <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">Dashboard</Link>}
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
              <Link to="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-gray-600 hover:text-gray-900">Log in</Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign up</Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {isAuthenticated && <Link to="/dashboard" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Dashboard</Link>}
              <Link to="/pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link to="/docs" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Documentation</Link>
              <div className="px-3 py-2 space-y-2">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900">Logout</button>
                ) : (
                  <>
                    <Link to="/login" className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900">Log in</Link>
                    <Link to="/register" className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
