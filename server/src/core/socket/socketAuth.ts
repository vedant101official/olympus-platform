import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const socketAuthMiddleware = (socket:Socket, next:any) => {
    try {
        const token = socket.handshake.auth.token;
        if(!token) {
            return next(new Error("Unauthorized"));
        }
        const decode = jwt.verify(token, env.JWT_SECRET);
        socket.data.user = decode;
        next();
    } catch (error) {
        next(new Error("Unauthorized"));
    }
    
}

