const multer = require("multer");
const { validationResult, body } = require("express-validator");

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    // accept file
    cb(null, true);
  } else {
    // reject file
    cb(null, false);
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"));
  }
};
// Multer upload object and file size limiter
const upload = multer({
  dest: "uploads/",
  fileFilter: fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
  },
}).single("picture");

// Middleware function to handle user uploads
const handleUserUpload = (req, res, next) => {
  upload(req, res, function (uploadError) {
    if (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    // Validation checks
    const validationChecks = [
      body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
      body("password")
        .isLength({ min: 5, max: 30 })
        .withMessage("Password must be at least 5 characters long"),
      body("phone").isMobilePhone().withMessage("Invalid phone number"),
      body("salary").isNumeric().withMessage("Invalid salary"),

    ];

    // Run validation checks
    for (let check of validationChecks) {
      check(req, res, () => {});
    }

    // return validation errors if there is any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  });
};

module.exports = handleUserUpload;
