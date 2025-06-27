import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4 md:py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-2">
            <span className="text-xl font-bold">
              <span className="text-blue-600">Eat</span>
              <span className="text-green-600">iT</span>
            </span>
          </Link>
          <p className="text-gray-500 text-xs md:text-sm">Your personal food and nutrition assistant</p>
          <div className="mt-3 md:mt-4 flex justify-center space-x-3 md:space-x-6">
            <a href="#" className="text-gray-400 text-xs md:text-sm hover:text-gray-600 transition-colors">Terms</a>
            <a href="#" className="text-gray-400 text-xs md:text-sm hover:text-gray-600 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 text-xs md:text-sm hover:text-gray-600 transition-colors">Contact</a>
          </div>
          <p className="mt-2 md:mt-3 text-gray-400 text-xs">© {new Date().getFullYear()} EatiT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
