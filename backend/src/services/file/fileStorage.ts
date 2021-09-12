import path from 'path';
import fs from 'fs';
import os from 'os';
import jwt from 'jsonwebtoken';
import { getConfig } from '../../config';

/**
 * The directory where the files should be uploaded.
 * Change this to a persisted folder.
 */
const UPLOAD_DIR = os.tmpdir();

export default class LocalFileStorage {
  /**
   * Creates a signed upload URL that enables
   * the frontend to upload directly to the server in a
   * secure way.
   *
   * @param {*} privateUrl
   * @param {*} maxSizeInBytes
   * @param {*} tokenExpiresAt
   */
  static async uploadCredentials(
    privateUrl,
    maxSizeInBytes,
    tokenExpiresAt?,
  ) {
    const expires =
      tokenExpiresAt || Date.now() + 10 * 60 * 1000;

    const token = jwt.sign(
      { privateUrl, maxSizeInBytes },
      getConfig().AUTH_JWT_SECRET,
      { expiresIn: expires },
    );

    return {
      url: `${
        getConfig().BACKEND_URL
      }/file/upload?token=${token}`,
    };
  }

  /**
   * Handles the upload to the server.
   */
  static async upload(fileTempUrl, privateUrl) {
    const internalUrl = path.join(UPLOAD_DIR, privateUrl);
    ensureDirectoryExistence(internalUrl);
    fs.renameSync(fileTempUrl, internalUrl);
    return this.downloadUrl(privateUrl);
  }

  /**
   * Return the download URL of the file from this server.
   */
  static async downloadUrl(privateUrl) {
    return `${
      getConfig().BACKEND_URL
    }/file/download?privateUrl=${privateUrl}`;
  }

  /**
   * Downloads the file.
   * @param {*} privateUrl
   */
  static async download(privateUrl) {
    return path.join(UPLOAD_DIR, privateUrl);
  }
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);

  if (fs.existsSync(dirname)) {
    return true;
  }

  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
