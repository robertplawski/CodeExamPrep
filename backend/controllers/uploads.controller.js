import mongoose from "mongoose";
import { storage, upload } from "../db/connectDB.js";
import { GridFSBucket } from "mongodb";
var gfs = null;
export const findMetadata = async (req, res, next) => {
  if (!gfs) {
    gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
  }

  const fileId = req.params.id;
  try {
    const Uploads = await mongoose.connection.collection("uploads.files");

    const file = await Uploads.findOne({
      _id: new mongoose.Types.ObjectId(fileId),
    });
    if (!file) {
      res.status(404).json({ error: "File not found" });
    } else {
      console.log(file);
      const readstream = gfs.openDownloadStream(
        new mongoose.Types.ObjectId(fileId)
      );
      res.status(200).json(file);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const downloadUploads = async (req, res, next) => {
  if (!gfs) {
    gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
  }

  const fileId = req.params.id;
  try {
    const Uploads = await mongoose.connection.collection("uploads.files");

    const file = await Uploads.findOne({
      _id: new mongoose.Types.ObjectId(fileId),
    });
    if (!file) {
      res.status(404).json({ error: "File not found" });
    } else {
      console.log(file);
      const readstream = gfs.openDownloadStream(
        new mongoose.Types.ObjectId(fileId)
      );
      res.set("Content-Type", file.contentType);
      readstream.pipe(res);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
