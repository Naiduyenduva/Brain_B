import mongoose, { Schema,model, mongo } from "mongoose";

const userSchema = new Schema({
    username: {type:String, require:true, unique: true},
    password: {type:String, require: true}
})
export const UserMOdel = mongoose.model("user",userSchema)

const contentSchema = new Schema ({
    title: {type: String},
    link: {type: String},
    tags: [{type:mongoose.Types.ObjectId, ref:'Tag'}],
    userId: {type:mongoose.Types.ObjectId, ref:'user', require: true}
})
export const contentModel = mongoose.model("Content",contentSchema)