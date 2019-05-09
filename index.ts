import * as admin from 'firebase-admin';
import { outputFile } from 'fs-extra';
import { File } from '@google-cloud/storage';
import * as dotenv from 'dotenv'

dotenv.config();
const { ACCOUNT_KEY_LOCATION, DATABASE_URL, STORAGE_BUCKET, DOWNLOAD_LOCATION } = process.env
const accountKey = require(ACCOUNT_KEY_LOCATION);

(async () => {
  admin.initializeApp({
    credential: admin.credential.cert(accountKey),
    databaseURL: DATABASE_URL,
    storageBucket: STORAGE_BUCKET
  });
  const [files] = await admin.storage().bucket().getFiles({})
  await Promise.all(
    files.map(saveFile)
  )
})();

const saveFile = async (file: File) => {
  const [buffer] = await file.download();
  if (!Array.isArray(buffer)) {
    await outputFile(`${DOWNLOAD_LOCATION}/${file.name}`, buffer)
  }
}
