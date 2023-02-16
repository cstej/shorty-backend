import expressAsyncHandler from "express-async-handler";
import { nanoid } from "nanoid";
import Url from "../models/urlModel";
import CustomError from "../utils/CustomError";

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
