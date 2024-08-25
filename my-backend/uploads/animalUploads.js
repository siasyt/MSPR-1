const express = require('express');
const multer = require('multer');
const path = require('path');

function animalUploads(database) {
    const router = express.Router();
    const animalImageCollection = database.collection('Animal_Image');

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../uploads/'));
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    const upload = multer({ storage: storage });

    router.post('/', upload.single('image'), async (req, res) => {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        try {
            const result = await animalImageCollection.insertOne({
                imagePath: req.file.filename,
                contentType: req.file.mimetype,
                uploadTime: new Date()
            });

            res.status(200).json({
                message: 'Image uploaded successfully!',
                data: {
                    imagePath: req.file.filename,
                    uploadTime: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Image upload failed:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
}

module.exports = animalUploads;




















