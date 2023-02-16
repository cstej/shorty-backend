const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);
export default Url;
