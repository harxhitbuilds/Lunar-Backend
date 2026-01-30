import express from "express";
import {
    getAllPlaylists,
    getFeaturedPlaylists,
    getPlaylistById,
} from "../controllers/playlist.controller.js";

const playlistRouter = express.Router();

playlistRouter.get("/", getAllPlaylists);
playlistRouter.get("/featured", getFeaturedPlaylists);
playlistRouter.get("/:id", getPlaylistById);

export default playlistRouter;