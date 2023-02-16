import expressAsyncHandler from "express-async-handler";
import { nanoid } from "nanoid";
import Url from "../models/urlModel";
import CustomError from "../utils/customError";

export const createShortUrl = expressAsyncHandler(async (req, res, next) => {
  const shortId = await nanoid(8);
  const body = req.body;
  if (!body.longUrl) {
    return next(new CustomError("longUrl is required", 400));
  }

  const url = await Url.create({
    shortId,
    redirectURL: body.longUrl,
    visitHistory: [],
  });
  return res.status(201).json({
    url,
    success: true,
  });
});

export const redirectUrl = expressAsyncHandler(async (req, res, next) => {
  const shortId = req.params.shortId;
  const entry = await Url.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

export const getAllurls = expressAsyncHandler(async (req, res, next) => {
  const user = req.user;
  const urls = await Url.find({ email: user.email });
  res.status(200).json(urls);
});

export const deleteUrl = expressAsyncHandler(async (req, res, next) => {
  const shortId = req.params.shortId;
  const url = await Url.findOneAndDelete({ shortId });

  res.status(200).json({
    url,
    success: true,
  });
});

// const shortId = req.params.shortId;
//   const entry = await URL.findOneAndUpdate(
//     {
//       shortId,
//     },
//     {
//       $push: {
//         visitHistory: {
//           timestamp: Date.now(),
//         },
//       },
//     }
//   );
//   res.redirect(entry.redirectURL);

// async function handleGenerateNewShortURL(req, res) {
//   const body = req.body;
//   if (!body.url) return res.status(400).json({ error: "url is required" });
//   const shortID = shortid();

//   await URL.create({
//     shortId: shortID,
//     redirectURL: body.url,
//     visitHistory: [],
//   });

//   return res.json({ id: shortID });
// }

// async function handleGetAnalytics(req, res) {
//   const shortId = req.params.shortId;
//   const result = await URL.findOne({ shortId });
//   return res.json({
//     totalClicks: result.visitHistory.length,
//     analytics: result.visitHistory,
//   });
// }

// module.exports = {
//   handleGenerateNewShortURL,
//   handleGetAnalytics,
// };
