// Enhanced File Upload Component for Product Images
import React, { useState, useRef } from 'react';
import './ProductImageUpload.css'; // Import the CSS file

const ProductImageUpload = ({ onImageSelect, maxFiles = 5 }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image format. Please select JPG, PNG, or WebP files.`);
        return false;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Please select files under 5MB.`);
        return false;
      }
      
      return true;
    });

    if (selectedFiles.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    onImageSelect && onImageSelect(newFiles);
  };

  // Handle input change
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Remove file
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onImageSelect && onImageSelect(newFiles);
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {/* Upload Area */}
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="upload-content">
          <div className="upload-icon">📷</div>
          <p className="upload-text">
            Click to upload or drag and drop images here
          </p>
          <p className="upload-subtext">
            JPG, PNG, WebP up to 5MB each (Max {maxFiles} images)
          </p>
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <h4>Selected Images ({selectedFiles.length}/{maxFiles})</h4>
          <div className="file-previews">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-preview">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="preview-image"
                />
                <div className="file-info">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="remove-button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;