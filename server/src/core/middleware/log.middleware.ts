import { Request, Response, NextFunction } from "express";

export const LogMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Query:", req.query);
    next();
}

export const ResponseTimeLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`Request processed in ${duration} ms`);
        if (res.statusCode >= 500) {
            console.log(`WARNING: Slow Response - ${duration}ms`);
        }
    })
    next();
}