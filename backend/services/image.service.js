// Mock Image Service replacing Cloudinary
// For this mock, we just store the file in the local /uploads directory 
// and return a local URL to serve it statically.
const fs = require('fs');
const path = require('path');

const uploadImage = async (file) => {
  if (!file) return null;
  
  // Since we are using multer to save the file locally anyway, 
  // we can just return the local path as the "mock Cloudinary URL".
  // Assuming the file was saved to 'uploads/filename.ext'
  const mockUrl = `/uploads/${file.filename}`;
  
  console.log(`📸 MOCK CLOUDINARY UPLOAD: File saved to ${mockUrl}`);
  return mockUrl;
};

module.exports = {
  uploadImage,
};
