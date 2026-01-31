import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      default: null,
    },
    playlistIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
        default: null
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Song", songSchema);
