import React from 'react';

const NutritionCard = ({ info }) => {
  console.log("NutritionCard received info:", info); // Add debug logging

  if (!info) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Nutritional Information</h2>
      
      {info.error ? (
        <div className="text-red-500 font-medium">{info.error}</div>
      ) : (
        <>
          {info.basicNutrients && Object.keys(info.basicNutrients).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {info.basicNutrients.calories !== undefined && (
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-700">{info.basicNutrients.calories}</div>
                  <div className="text-xs uppercase tracking-wider text-blue-600 font-medium">Calories</div>
                </div>
              )}
              {info.basicNutrients.protein_g !== undefined && (
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-700">{info.basicNutrients.protein_g}</div>
                  <div className="text-xs uppercase tracking-wider text-green-600 font-medium">Protein (g)</div>
                </div>
              )}
              {info.basicNutrients.fat_g !== undefined && (
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-yellow-700">{info.basicNutrients.fat_g}</div>
                  <div className="text-xs uppercase tracking-wider text-yellow-600 font-medium">Fat (g)</div>
                </div>
              )}
              {info.basicNutrients.carbs_g !== undefined && (
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-700">{info.basicNutrients.carbs_g}</div>
                  <div className="text-xs uppercase tracking-wider text-purple-600 font-medium">Carbs (g)</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-500 mb-6">No nutrition data available</div>
          )}

          {info.positives && info.positives.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-800 mb-2">Health Benefits</h3>
              <ul className="list-disc pl-5 space-y-1">
                {info.positives.map((positive, i) => (
                  <li key={i} className="text-green-700">{positive}</li>
                ))}
              </ul>
            </div>
          )}

          {info.negatives && info.negatives.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-800 mb-2">Health Concerns</h3>
              <ul className="list-disc pl-5 space-y-1">
                {info.negatives.map((negative, i) => (
                  <li key={i} className="text-red-700">{negative}</li>
                ))}
              </ul>
            </div>
          )}

          {info.verdict && (
            <div className={`mt-4 p-3 rounded-lg ${
              info.verdict === 'healthy' ? 'bg-green-50 text-green-800' :
              info.verdict === 'unhealthy' ? 'bg-red-50 text-red-800' :
              'bg-yellow-50 text-yellow-800'
            }`}>
              <h3 className="font-medium mb-1">Overall Assessment</h3>
              <p>{info.verdict.charAt(0).toUpperCase() + info.verdict.slice(1)}: {info.verdict === 'healthy' ? 'Recommended' : info.verdict === 'unhealthy' ? 'Use caution' : 'Acceptable in moderation'}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NutritionCard;
