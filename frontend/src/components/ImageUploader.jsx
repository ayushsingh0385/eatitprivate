import React from 'react';

const ImageUploader = ({ onFileChange, onUpload, preview, loading }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Upload Image</h2>
      </div>
      <div className="card-body">
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="input-file"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          Choose an image
        </label>
        
        {preview && (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-img" />
          </div>
        )}
        
        <button 
          onClick={onUpload} 
          className="btn btn-full" 
          disabled={loading || !preview}
        >
          {loading ? "Processing..." : "Analyze Image"}
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
