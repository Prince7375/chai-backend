import multer from "multer";


//using multer to save the uploaded file locallacy before uploading it to the cloudinary
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,

}) 