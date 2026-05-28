import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Profile from './models/Profile.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resumeFile = process.argv[2] || 'resume.pdf';
const resumePath = path.resolve(__dirname, resumeFile);

const getContentType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.pdf':
      return 'application/pdf';
    case '.doc':
      return 'application/msword';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return 'application/octet-stream';
  }
};

const main = async () => {
  try {
    await connectDB();

    if (!fs.existsSync(resumePath)) {
      console.error(`Resume file not found: ${resumePath}`);
      process.exit(1);
    }

    const fileBuffer = fs.readFileSync(resumePath);
    const contentType = getContentType(resumePath);
    const filename = path.basename(resumePath);

    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({
        resume: {
          filename,
          contentType,
          data: fileBuffer,
        },
      });
    } else {
      profile.resume = {
        filename,
        contentType,
        data: fileBuffer,
      };
    }

    await profile.save();
    console.log('✅ Resume uploaded to the database successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to upload resume:', error);
    process.exit(1);
  }
};

main();
