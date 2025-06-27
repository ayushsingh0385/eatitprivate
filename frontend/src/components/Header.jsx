import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { Menu, X, Home, User, LogOut, Settings, MessageCircle, Camera } from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo/Home */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">
                <span className="text-blue-600">Eat</span>
                <span className="text-green-600">iT</span>
              </span>
            </Link>
          </div>

          {/* Right side - Profile Menu */}
          <div className="flex items-center">
            <div className="ml-3 relative">
              <button
                onClick={toggleMenu}
                className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 p-1"
              >
                <span className="sr-only">Open user menu</span>
                {user ? (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={toggleMenu}
                  ></div>
                  
                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      {user ? `Signed in as ${user.name || 'User'}` : 'Menu'}
                    </div>

                    <Link 
                      to="/"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Link>
                    
                    <Link 
                      to="/scan" 
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Scan
                    </Link>
                    
                    <Link 
                      to="/chat" 
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Link>

                    {user ? (
                      <>
                        <Link 
                          to="/profile" 
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                        
                        <Link 
                          to="/posts" 
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Community
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/login" 
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign in
                        </Link>
                        <Link 
                          to="/signup" 
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
