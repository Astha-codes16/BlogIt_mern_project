import dotenv from 'dotenv';
dotenv.config();

const {v2:cloudinary}=await import('cloudinary');

const hasIndividualCredentials=process.env.CLOUDINARY_CLOUD_NAME &&
	process.env.CLOUDINARY_API_KEY &&
	process.env.CLOUDINARY_API_SECRET;

if(hasIndividualCredentials){
	cloudinary.config({
		cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
		api_key:process.env.CLOUDINARY_API_KEY,
		api_secret:process.env.CLOUDINARY_API_SECRET
	});
} else {
	cloudinary.config();
}

export default cloudinary;
