import React, { useRef, useEffect, useState } from 'react';

const CameraCapture = ({ onCapture, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // Default to back camera

  const startCamera = async () => {
    try {
      // Clear any previous errors
      setError(null);
      
      // Stop any existing stream
      if (stream) {
        stopCamera();
      }
      
      // Get new stream with selected camera
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      
      // Set stream to state and video element
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(`Camera error: ${err.message || 'Could not access camera'}`);
    }
  };

  const switchCamera = () => {
    // Toggle between front and back camera
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame onto the canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        onCapture(blob);
        stopCamera();
      }, 'image/jpeg', 0.95); // 95% quality JPEG
    } catch (err) {
      console.error("Error capturing image:", err);
      setError(`Capture error: ${err.message || 'Failed to capture image'}`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
  };

  // Initialize camera when component mounts
  useEffect(() => {
    startCamera();
    
    // Cleanup when component unmounts
    return () => {
      stopCamera();
    };
  }, [facingMode]); // Re-run when facingMode changes

  return (
    <div className="camera-capture">
      <div className="camera-container">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="camera-video" 
          onLoadedMetadata={() => videoRef.current?.play()}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
      {error && (
        <div className="alert alert-error">
          <i className="icon-error"></i> {error}
        </div>
      )}
      
      <div className="camera-controls">
        <button onClick={switchCamera} className="btn btn-secondary">
          <i className="icon-switch"></i> Switch Camera
        </button>
        <button onClick={captureImage} className="btn btn-alternative">
          <i className="icon-capture"></i> Capture
        </button>
        <button onClick={onCancel} className="btn btn-outline">
          <i className="icon-close"></i> Cancel
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
