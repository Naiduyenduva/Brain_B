import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { contentModel, linkModel, UserMOdel } from "./db";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

const JWT_password = process.env.JWT_Password as string

mongoose.connect(process.env.MongoURL as string)

console.log(JWT_password)

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
        }, JWT_password)
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
    const type = req.body.type
    await contentModel.create({
        title,
        link,
        type,
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
    await contentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    })
    res.json({
        message: "content deleted"
    })

})
app.post("/api/v1/brain/share",userMiddleware, async (req,res)=> {
    const share = req.body.share;
    if(share) {
        await linkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: random(10)
        });
    } else {
        await linkModel.deleteMany({
            //@ts-ignore
            userId: req.userId
        });
    }
    res.json({
        message: "Link updated"
    })

})
app.get("/api/v1/brain/:shareLink", async (req,res)=> {
    const hash = req.params.shareLink;

    const link = await linkModel.findOne({
        hash
    });

    if(!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    const content = await contentModel.findOne({
        userId: link.userId
    })
    const user = await UserMOdel.findOne({
        _id: link.userId
    })
    if(!user) {
        res.status(411).json({
            message: "user not found"
        })
        return;
    }
    res.json({
        username: user.username,
        content
    })
    
})

app.listen(3000);