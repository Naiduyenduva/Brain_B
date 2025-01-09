import express from "express";
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { contentModel, UserMOdel } from "./db";
import { userMiddleware } from "./middleware";

const JWT_Password = "damnnmad"

mongoose.connect("mongodb+srv://luckyrkb16:lucky123@cluster0.udmxssz.mongodb.net/brain_B")

const app = express();
app.use(express.json())

app.post("/api/v1/signup", async(req,res)=> {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserMOdel.create({
            username: username,
            password: password
        })
        res.json({
            message: "signup successfull"
        })
        
    } catch (error) {
        res.status(411).json({
            messsage: "user already exists"
        })
    }
})
app.post("/api/v1/signin", async (req,res)=> {
    const username = req.body.username;
    const password = req.body.password

    const existingUser = await UserMOdel.findOne({
        username,
        password
    })

    if(existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_Password)
        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }

})
app.post("/api/v1/content",userMiddleware,async (req,res)=> {
    const title = req.body.title;
    const link = req.body.link;
    await contentModel.create({
        title,
        link,
        //@ts-ignore
        userId:req.userId,
        tags:[]
    })
    res.json({
        message: "content added"
    })

})
app.get("/api/v1/content",userMiddleware, async (req,res)=> {
    //@ts-ignore
    const userId = req.userId;
    const userContent = await contentModel.find({
        userId
    }).populate("userId","username")
    res.json({
        userContent
    })

})
app.delete("/api/v1/content",userMiddleware, async(req,res)=> {
    const contentId = req.body.contentId;
    //@ts-ignore
    const userId = req.userId;
    await contentModel.deleteMany({
        contentId,
        userId
    })
    res.json({
        message: "content deleted"
    })

})
app.post("/api/v1/brain/share", (req,res)=> {

})
app.get("/api/v1/brain:shareLink", (req,res)=> {

})

app.listen(3000);