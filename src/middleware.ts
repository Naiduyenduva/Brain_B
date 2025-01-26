import { NextFunction,Response,Request } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
// const JWT_Password = "damnnmad"
const JWT_password = process.env.JWT_Password as string


export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string,JWT_password);

    if(decoded) {
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in"
            })
            return;    
        }
        //@ts-ignore
        req.userId = (decoded as JwtPayload).id;
        next()
    } else {
        res.status(403).json({
            message: "user not logged in"
        })
    }

}