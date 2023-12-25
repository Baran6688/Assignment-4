const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Model = mongoose.model

const blogsSchema = new Schema(
	{
		author: { type: String, required: [true, "author name is required!"] },
		content: { type: String, required: [true, "content is required!"] },
	},
	{ timestamps: true }
)

const Blog = Model("Blog", blogsSchema)
module.exports = Blog
