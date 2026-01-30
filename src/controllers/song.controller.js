import Song from "../models/song.model.js";

export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Songs fetched successfully",
      songs,
    });
  } catch (error) {
    console.error("Error in fetching all songs:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching all songs.",
    });
  }
};

export const getFeaturedSongs = async (req, res) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 9 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          coverImage: 1,
          duration: 1,
          url: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "Featured songs fetched successfully",
      songs,
    });
  } catch (error) {
    console.error("Error in fetching features songs:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching featured songs.",
    });
  }
};

export const trendingSongs = async (req, res) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          coverImage: 1,
          duration: 1,
          url: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "Featured songs fetched successfully",
      songs,
    });
  } catch (error) {
    console.error("Error in fetching trending songs:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching trending songs.",
    });
  }
};

export const getMadeForYouSongs = async (req, res) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          coverImage: 1,
          duration: 1,
          url: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "Made for you songs fetched successfully",
      songs,
    });
  } catch (error) {
    console.error("Error in fetching made for you songs:", error);
    res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while fetching made for you songs.",
    });
  }
};

export const searchSongs = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message:
          "Query parameter 'name' is required and must be a non-empty string for searching songs.",
      });
    }
    const searchRegex = new RegExp(name.trim(), "i");
    const songs = await Song.find({
      $or: [
        { title: { $regex: searchRegex } },
        { artist: { $regex: searchRegex } },
      ],
    }).select("_id title artist coverImage duration url");
    res.status(200).json({
      success: true,
      message: "Songs fetched successfully",
      songs,
    });
  } catch (error) {
    console.error("Error in searching songs:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while searching songs.",
    });
  }
};


