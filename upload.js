const glob = require("glob");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.COUDINARY_NAME,
    api_key: process.env.COUDINARY_API_KEY,
    api_secret: process.env.COUDINARY_API_SECRET
});

const fileCache = new Set();

const upload = (async () => {
    const allFiles = await cloudinary.api.resources({
        type: "upload",
        prefix: "database-assets"
    }).catch(console.log)
    allFiles.resources.forEach((f) => fileCache.add(`${f.public_id.replace("database-assets/" , "")}.${f.format}`));

    glob("nc/uploads/noco/**/**/*", {
        nodir: true
    }, (err, matches) => {

        matches.forEach((path) => {
            const filePath = `database-assets/${path.replace("nc/uploads/noco/", "").split("/").slice(0, 3).join("/")}`;
            const checkIfExists = allFiles.resources.some((f) => `${f.public_id}.${f.format}`
                .endsWith(path.replace("nc/uploads/noco/", "")));

            if (!checkIfExists) {
                cloudinary.uploader.upload(path, {
                    folder: filePath,
                    use_filename: true,
                    unique_filename: false
                });
            }
        });
    });
});

module.exports.upload = upload;
module.exports.fileCache = fileCache;