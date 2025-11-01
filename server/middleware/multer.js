//here we created upload middleware using multer package
import multer from "multer";
const upload=multer({storage:multer.diskStorage({})})
export default upload;