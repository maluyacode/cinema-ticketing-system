const cloudinary = require('cloudinary');

class ImageCloudinary {

    constructor() {

    }

    static async uploadSingle(postImage, folderName) {

        const result = await cloudinary.v2.uploader.upload(postImage, {
            folder: 'profiles', // folder name in cloudinary, if not exist it will create automatically.
            // width: 200, 
            // crop: "scale",
        });

        return {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    static async uploadMultiple(postImages, folderName) {

        let images = []
        for (let i = 0; i < postImages.length; i++) {

            let image = postImages[i].path;

            const result = await cloudinary.v2.uploader.upload(image, {
                folder: folderName, // folder name in cloudinary, if not exist it will create automatically.
                // width: 200, 
                // crop: "scale",
            });

            images.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        return images
    }
}

module.exports = ImageCloudinary;