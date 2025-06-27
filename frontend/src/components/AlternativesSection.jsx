import React from 'react';

const AlternativesSection = ({ data, label }) => {
  const { alternatives = [], amazonProducts = [], youtubeRecipes = [] } = data;

  if (!alternatives.length && !amazonProducts.length && !youtubeRecipes.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Healthier Alternatives</h2>
      
      {alternatives.length > 0 && (
        <div className="mb-6">
          <p className="text-base text-gray-700 mb-3">
            Try these healthier alternatives to {label}:
          </p>
          <div className="flex flex-wrap gap-2">
            {alternatives.map((alt, index) => (
              <span 
                key={index} 
                className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {alt}
              </span>
            ))}
          </div>
        </div>
      )}

      {amazonProducts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-200">
            Recommended Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {amazonProducts.map((product, index) => (
              <a 
                key={index}
                href={product.url || "#"} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                <div className="w-1/3 bg-gray-100">
                  <img 
                    src={product.image || "https://via.placeholder.com/150"} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-3">
                  <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                  {product.price && (
                    <p className="text-orange-600 font-semibold mt-1 text-sm">{product.price}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {youtubeRecipes.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-200">
            Healthy Recipe Videos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {youtubeRecipes.map((video, index) => (
              <a 
                key={index}
                href={video.url || "#"} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative">
                  <img 
                    src={video.thumbnail || "https://via.placeholder.com/320x180"} 
                    alt={video.title}
                    className="w-full h-32 object-cover" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <div className="ml-1 w-0 h-0 border-t-5 border-t-transparent border-l-8 border-l-white border-b-5 border-b-transparent"></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{video.channelTitle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlternativesSection;
