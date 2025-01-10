import { NextFunction,Response,Request } from "express"
import jwt from "jsonwebtoken";
// const JWT_Password = "damnnmad"
const JWT_password = process.env.JWT_Password as string


export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string,JWT_password);

    if(decoded) {
        //@ts-ignore
        req.userId = decoded.id;
        next()
    } else {
        res.status(403).json({
            message: "user not logged in"
        })
    }

}