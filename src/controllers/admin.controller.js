import Song from "../models/song.model.js";
import Album from "../models/album.model.js";
import Playlist from "../models/playlist.model.js";
import { uploadToFirebase, deleteFromFirebase } from "../utils/media.operations.js";

export const addSong = async (req, res) => {
  try {
    const { title, artist, duration, albumId } = req.body;
    if (!title || !artist || !duration) {
      return res.status(400).json({
        success: false,
        message: "Title, artist, and duration are required fields.",
      });
    }
    const imageFile = req.files["coverImage"]?.[0];
    const audioFile = req.files["audioFile"]?.[0];
    if (!imageFile || !audioFile) {
      return res.status(400).json({
        success: false,
        message: "Cover image and audio file are required.",
      });
    }
    const coverImageUrl = await uploadToFirebase(imageFile);
    const audioFileUrl = await uploadToFirebase(audioFile);
    const newSong = new Song({
      title,
      artist,
      coverImage: coverImageUrl,
      duration,
      url: audioFileUrl,
      albumId: albumId || null,
    });
    await newSong.save();
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: newSong._id },
      });
    }

    res.status(201).json({
      success: true,
      message: "Song added successfully",
      song: newSong,
    });
  } catch (error) {
    console.error("Error adding song:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while adding the song.",
    });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Song ID is required",
      });
    }
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await deleteFromFirebase(song.coverImage);
    await deleteFromFirebase(song.url);

    await Song.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Song deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting the song.",
    });
  }
};

export const addAlbum = async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!title || !artist) {
      return res.status(400).json({
        success: false,
        message: "Title and artist are required fields.",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required.",
      });
    }
    const coverImageUrl = await uploadImageToFirebase(req.file);
    const newAlbum = new Album({
      title,
      artist,
      coverImage: coverImageUrl,
    });
    await newAlbum.save();
    res.status(201).json({
      success: true,
      message: "Album added successfully",
      album: newAlbum,
    });
  } catch (error) {
    console.error("Error adding album:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while adding the album.",
    });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Album ID is required",
      });
    }
    await Song.deleteMany({ album: id });
    await Album.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Album and its associated songs deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting the album.",
    });
  }
};

export const addPlaylist = async (req, res) => {
  try {
    const { title, artist, songs } = req.body;
    if (!title || !artist || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title, artist, and cover image are required.",
      });
    }
    const coverImageUrl = await uploadToFirebase(req.file);
    const newPlaylist = new Playlist({
      title,
      artist,
      coverImage: coverImageUrl,
      songs: songs || [],
    });
    await newPlaylist.save();
    res.status(201).json({
      success: true,
      message: "Playlist added successfully",
      playlist: newPlaylist,
    });
  } catch (error) {
    console.error("Error adding playlist:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while adding the playlist.",
    });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Playlist ID is required",
      });
    }
    await Playlist.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting the playlist.",
    });
  }
};

export const checkAdmin = async (req, res) => {
  return res.status(200).json({ admin: true });
}

