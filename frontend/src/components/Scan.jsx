import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import NutritionCard from './NutritionCard';
import AlternativesSection from './AlternativesSection';
import CameraCapture from './CameraCapture';
import './Scan.css';
import axios from 'axios';
import { Camera, Upload } from 'lucide-react';

function Scan() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCapture = (imageBlob) => {
    if (!imageBlob) {
      setError('Failed to capture image.');
      return;
    }
    
    // Create a File object from the Blob
    const capturedFile = new File([imageBlob], "camera-capture.jpg", {
      type: "image/jpeg",
      lastModified: Date.now()
    });
    
    setFile(capturedFile);
    setPreview(URL.createObjectURL(imageBlob));
    setCameraActive(false);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select or capture an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL || 'http://localhost:3000'}/api/identify`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = response.data;
      console.log("Received data from server:", data);

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error("Error during API call:", err);
      setError(err.message || 'An error occurred while processing the request.');
    } finally {
      setLoading(false);
    }
  };

  // Check if device has camera capabilities
  const [hasCamera, setHasCamera] = useState(true);
  
  React.useEffect(() => {
    // Check if the device has camera capabilities
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCamera(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Scan Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            <span className="text-blue-600">Food</span>
            <span className="text-green-600">Scanner</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Upload or capture food images for instant nutrition analysis
          </p>
        </div>
        
        {/* Scan Container */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6 overflow-hidden">
          <div className="p-6">
            {cameraActive ? (
              <CameraCapture onCapture={handleCapture} onCancel={() => setCameraActive(false)} />
            ) : (
              <div className="scan-options space-y-4">
                {hasCamera && (
                  <button 
                    onClick={() => setCameraActive(true)} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Take Photo
                  </button>
                )}
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h2 className="font-semibold text-gray-800 mb-3">Upload Image</h2>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="w-full bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors">
                    <Upload className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-blue-600 font-medium">Choose an image</span>
                    <span className="text-sm text-gray-500 mt-1">or drag and drop here</span>
                  </label>
                  
                  {preview && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                      <img src={preview} alt="Preview" className="w-full max-h-64 object-contain" />
                    </div>
                  )}
                  
                  <button 
                    onClick={handleUpload} 
                    disabled={loading || !preview}
                    className={`w-full mt-4 py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${
                      loading || !preview 
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : "Analyze Image"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {result && !error && (
          <div className="results-container">
            {result?.analysis && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {result.analysis.product || 'Food Information'}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {result.analysis.productDescription}
                </p>
              </div>
            )}

            {result?.analysis && <NutritionCard info={result.analysis} />}

            {result?.analysis?.alternatives && result.analysis.alternatives.length > 0 && (
              <AlternativesSection 
                data={{
                  alternatives: result.analysis.alternatives,
                  amazonProducts: result.analysis.amazonProducts || [],
                  youtubeRecipes: result.analysis.youtubeRecipes || []
                }} 
                label={result.analysis.product || 'item'}
              />
            )}
          </div>
        )}
        
        {/* Tips Section */}
        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mb-6">
          <h3 className="font-medium mb-2">💡 Scan Tips:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Take clear, well-lit photos of food items</li>
            <li>For packaged foods, scan the nutrition label for more detailed information</li>
            <li>Ensure the food is centered in the image</li>
            <li>Avoid scanning multiple different food items in one image</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Scan;
