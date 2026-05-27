import { Request, Response, NextFunction } from "express";
import  { askAI } from "./ai.service";

export const chatWithAI = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const {message} = req.body;

    if (!message) {
        throw new Error("messasge is required");
    }
    const response = await askAI(message);
    res.status(200).json({
        success: true,
        data: response
    });
  } catch (error) {
    next(error);
  }
}