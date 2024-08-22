import mongoose from "mongoose";
import Post from "./post.model";


const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
        trim: true, 
      },
})
const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema)

export default Tag;