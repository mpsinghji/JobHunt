import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "profilePhoto") {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Not an image! Please upload an image."), false);
        }
    } else if (file.fieldname === "resume") {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Please upload a PDF file"), false);
        }
    } else {
        cb(null, true);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
});

export const singleUpload = upload.single("file");
export const profilePhotoUpload = upload.single("profilePhoto");

export const uploadFiles = upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 }
]);
