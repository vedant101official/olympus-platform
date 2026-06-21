import { Request, Response, NextFunction } from "express";
import { parsePdf } from "./pdf.service";
import { saveDocumentChunks } from "./document.service";



export const uploadDocument = async (
req:Request,
res:Response,
next:NextFunction
) => {

try {

    if(!req.file){
        throw new Error("No file uploaded");
    }

    if(!req.user){
        throw new Error("User not authenticated");
    }

    const text = await parsePdf(
        req.file.path
    );

    await saveDocumentChunks(
        req.user.tenantId,
        req.file.originalname,
        text
    );

    res.status(201).json({
        success:true,
        message:"Document indexed"
    });

}
catch(error){
    next(error);
}

}