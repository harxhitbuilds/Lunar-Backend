import express from "express";
import {
  getAllAlbums,
  getAlbumById,
  getFeaturedAlbums,
} from "../controllers/album.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
const albumRouter = express.Router();

albumRouter.get("/", getAllAlbums);
albumRouter.get("/featured", getFeaturedAlbums);
albumRouter.get("/:id", getAlbumById);

export default albumRouter;
