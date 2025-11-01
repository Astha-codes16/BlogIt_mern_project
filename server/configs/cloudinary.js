// configs/cloudinary.js

import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv'; // No longer needed for this test

// **PASTE YOUR ACTUAL CREDENTIALS HERE**
const YOUR_API_KEY = "978665557765772";        // Example: 123456789012345
const YOUR_API_SECRET = "pbBjUULTfA6gf68DG0z-WQ-AqGk";   // Example: abcdef1234567890
const YOUR_CLOUD_NAME = "djghqq7xb";   // Example: my-blog-app

// Configure Cloudinary using the individual credentials
cloudinary.config({ 
  cloud_name: "djghqq7xb",
  api_key: "978665557765772",
  api_secret: "pbBjUULTfA6gf68DG0z-WQ-AqGk"
});

export default cloudinary;
// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv'; 

// // CRITICAL: Ensure dotenv loads the variables BEFORE Cloudinary initializes
// dotenv.config(); 

// // Configure Cloudinary using the single CLOUDINARY_URL environment variable
// cloudinary.config({ 
//   cloudinary_url: process.env.CLOUDINARY_URL 
// });

// export default cloudinary;