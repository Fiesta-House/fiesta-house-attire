const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({ secure: true });

const SRC = 'C:\\Users\\mikek\\Desktop\\site-static-images';
const FOLDER = 'fiesta-house-site-static';

(async () => {
  const files = fs.readdirSync(SRC).filter(f => /\.jpe?g$/i.test(f));
  for (const file of files) {
    const base = path.parse(file).name.replace(/[^A-Za-z0-9_-]/g, '_');
    const publicId = `${FOLDER}/${base}`;
    try {
      const res = await cloudinary.uploader.upload(path.join(SRC, file), {
        public_id: publicId,
        overwrite: false,
        resource_type: 'image'
      });
      console.log(`${file}  ->  ${res.secure_url}`);
    } catch (err) {
      console.log(`${file}  FAILED: ${err.message}`);
    }
  }
})();
