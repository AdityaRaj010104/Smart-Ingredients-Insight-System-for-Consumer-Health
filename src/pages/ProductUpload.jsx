// src/pages/ProductUpload.jsx
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, X, Check, AlertCircle, ArrowLeft, Image as ImageIcon, Scan, RotateCw, Crop, ZoomIn, ZoomOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { APP_NAME } from '../lib/constants';

const ProductUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [formData, setFormData] = useState({
    productName: searchQuery,
    brandName: '',
    weight: '',
    category: '',
  });
  
  const [nutritionImage, setNutritionImage] = useState(null);
  const [nutritionPreview, setNutritionPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  // Image editing states
  const [showEditor, setShowEditor] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadStatus({ type: 'error', message: 'Image size should be less than 10MB' });
        return;
      }
      setNutritionImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setNutritionPreview(event.target.result);
        setShowEditor(true);
        setRotation(0);
        setScale(1);
        setCrop({ x: 0, y: 0, width: 100, height: 100 });
      };
      reader.readAsDataURL(file);
      setUploadStatus(null);
    }
  };

  const removeImage = () => {
    setNutritionImage(null);
    setNutritionPreview(null);
    setShowEditor(false);
    setRotation(0);
    setScale(1);
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const applyEdits = () => {
    if (!nutritionPreview || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Set canvas size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      const editedFile = new File([blob], nutritionImage.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
      setNutritionImage(editedFile);
      setNutritionPreview(canvas.toDataURL('image/jpeg'));
      setShowEditor(false);
    }, 'image/jpeg', 0.95);
  };

  const cancelEdit = () => {
    setShowEditor(false);
    setRotation(0);
    setScale(1);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.productName.trim()) {
      setUploadStatus({ type: 'error', message: 'Please enter product name' });
      return;
    }
    if (!formData.brandName.trim()) {
      setUploadStatus({ type: 'error', message: 'Please enter brand name' });
      return;
    }
    if (!nutritionImage) {
      setUploadStatus({ type: 'error', message: 'Please upload nutrition table image' });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('brandName', formData.brandName);
      formDataToSend.append('weight', formData.weight);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('nutritionImage', nutritionImage);

      // Replace with your actual API endpoint
      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus({ type: 'success', message: 'Product uploaded successfully! Redirecting...' });
        
        // Reset form after 2 seconds and navigate
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: 'Upload failed. Please try again or contact support.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Scan className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload New Product
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Help us expand our database by adding product information and nutrition details. Your contribution helps others make informed choices.
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 md:p-8">
          <div className="space-y-8">
            {/* Product Information Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full text-lg font-bold">
                  1
                </span>
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Information
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="e.g., Chocolate Chip Cookies"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChange}
                    placeholder="e.g., Parle, Britannia"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight/Size
                  </label>
                  <Input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 100g, 500ml"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Select category</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                    <option value="dairy">Dairy</option>
                    <option value="bakery">Bakery</option>
                    <option value="frozen">Frozen Foods</option>
                    <option value="cereals">Cereals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Nutrition Image Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full text-lg font-bold">
                  2
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Nutrition Table Image
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a clear photo of the nutrition facts table
                  </p>
                </div>
              </div>

              {!nutritionPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-emerald-500 transition-colors bg-gray-50">
                  <label className="flex flex-col items-center cursor-pointer">
                    <div className="bg-white p-6 rounded-full mb-4 shadow-sm">
                      <ImageIcon className="w-12 h-12 text-emerald-600" />
                    </div>
                    <span className="text-lg font-medium text-gray-700 mb-2">
                      Click to upload nutrition table photo
                    </span>
                    <span className="text-sm text-gray-500 mb-4">
                      PNG, JPG, JPEG up to 10MB
                    </span>
                    <span className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                      Choose Image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              ) : showEditor ? (
                <div className="space-y-4">
                  {/* Image Editor */}
                  <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                    <div className="relative bg-white rounded-lg overflow-hidden" style={{ maxHeight: '500px' }}>
                      <img
                        ref={imageRef}
                        src={nutritionPreview}
                        alt="Nutrition table"
                        className="w-full h-auto object-contain"
                        style={{
                          transform: `rotate(${rotation}deg) scale(${scale})`,
                          transition: 'transform 0.3s ease',
                          maxHeight: '500px'
                        }}
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Editor Controls */}
                    <div className="mt-4 flex flex-wrap gap-3 items-center justify-center">
                      <button
                        onClick={rotateImage}
                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <RotateCw className="w-4 h-4" />
                        Rotate
                      </button>
                      
                      <div className="flex items-center gap-2 bg-white border-2 border-gray-300 rounded-lg px-4 py-2">
                        <button
                          onClick={handleZoomOut}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium min-w-[3rem] text-center">
                          {Math.round(scale * 100)}%
                        </span>
                        <button
                          onClick={handleZoomIn}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Apply/Cancel Buttons */}
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={applyEdits}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                  <div className="relative">
                    <img
                      src={nutritionPreview}
                      alt="Nutrition table"
                      className="w-full max-h-96 object-contain rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setShowEditor(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Crop className="w-4 h-4" />
                      Edit Image
                    </button>
                    <div className="flex-1 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {nutritionImage.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(nutritionImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Message */}
            {uploadStatus && (
              <div className={`p-4 rounded-lg flex items-center gap-3 border ${
                uploadStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                {uploadStatus.type === 'success' ? (
                  <Check className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="font-medium">{uploadStatus.message}</span>
              </div>
            )}

            {/* Submit Buttons */}
            {!showEditor && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Product
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductUpload;