import Playlist from "../models/playlist.model.js";

export const getAllPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Playlists fetched successfully",
            playlists,
        });
    } catch (error) {
        console.error("Error in fetching all playlists:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred while fetching all playlists.",
        });
    }
};

export const getFeaturedPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.aggregate([
            { $sample: { size: 4 } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    coverImage: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Featured playlists fetched successfully",
            playlists,
        });
    } catch (error) {
        console.error("Error in fetching featured playlists:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred while fetching featured playlists.",
        });
    }
};

export const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Playlist id is required",
            });
        }
        const playlist = await Playlist.findById(id).populate("songs");
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlist,
        });
    } catch (error) {
        console.error("Error in fetching playlist by Id:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred while fetching playlist by Id.",
        });
    }
};