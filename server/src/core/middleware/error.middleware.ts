import { Request, Response, NextFunction   } from "express";

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorMiddleware = (err:any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error :",{
        message :err.message,
        stack: err.stack,
        path: err.originalUrl,
        method:req.method,
    });

    const statusCode = err.statuCode || 500;
    res.status(statusCode).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
}