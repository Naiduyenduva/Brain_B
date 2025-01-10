import mongoose, { Schema,model, mongo } from "mongoose";

const userSchema = new Schema({
    username: {type:String, required:true, unique: true},
    password: {type:String, required: true}
})
export const UserMOdel = mongoose.model("user",userSchema)

const contentTypes = ['image', 'video', 'article', 'audio']; // Extend as needed


const contentSchema = new Schema ({
    link: { type: String },
    type: { type:String, enum:contentTypes, required: true},
    title: { type: String},
    tags: [{type:mongoose.Types.ObjectId, ref:'Tag'}],
    userId: {type:mongoose.Types.ObjectId, ref:'user', required: true}
})
export const contentModel = mongoose.model("Content",contentSchema)

const tagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }
  });
 export const tagModel = mongoose.model("Tag",tagSchema) 

 const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique:true },
  });

  export const linkModel = mongoose.model("Link",linkSchema)