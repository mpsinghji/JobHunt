import multer from "multer";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profilePhoto" || file.fieldname === "file") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  } else {
    cb(new Error("Invalid field name"), false);
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
