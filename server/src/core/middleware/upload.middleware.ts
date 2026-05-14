import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null,"upload/");
    },
    filename: (req,files,cb) => {
        const uniqueName =  Date.now() + "-" + files.originalname.replace(/\s/g,"_");
        cb(null,uniqueName);
    }
})

export const upload = multer({storage});
