import multer from "multer";

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
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

// Export multiple upload configurations
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// For single file uploads
export const singleUpload = upload.single("profilePhoto");

export const uploadFiles = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 }
]);
