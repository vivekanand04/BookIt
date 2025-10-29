import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
}

export default function Header({ searchQuery = '', onSearchChange, showSearch = true }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange && searchQuery) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer flex-shrink-0" 
            onClick={() => navigate('/')}
          >
            <img 
              src="/heading.png" 
              alt="highway delite" 
              className="h-10 w-auto bg-white"
            />
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <input
                type="text"
                placeholder={isHomePage ? "Search experiences" : ""}
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                style={{ maxWidth: '280px' }}
                className="w-full px-4 py-2 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="btn-primary flex-shrink-0 whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden flex items-center gap-3">
            {!showMobileSearch ? (
              <button
                onClick={() => setShowMobileSearch(true)}
                className="p-2 text-gray-600 hover:text-gray-900"
                aria-label="Open search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            ) : (
              <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 ml-4">
                <input
                  type="text"
                  placeholder={isHomePage ? "Search experiences" : ""}
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-black font-medium px-3 py-2 rounded text-sm whitespace-nowrap"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowMobileSearch(false)}
                  className="p-2 text-gray-600"
                  aria-label="Close search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

