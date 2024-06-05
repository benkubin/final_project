const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

// Enable CORS for all origins (you can restrict it to specific origins if needed)
// app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5000/upload"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Endpoint to handle image upload
app.post('/upload', upload.single('file'), (req, res, next) => {
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
