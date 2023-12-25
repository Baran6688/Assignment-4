require("dotenv").config()
const { Server } = require("socket.io")
const express = require("express")
const app = express()
const path = require("path")
const http = require("http")
const server = http.createServer(app)
const io = new Server(server, {
	cors: { origin: "*" },
})
io.on("connection", socket => {
	console.log("a user connected")

	socket.on("blog", newBlog => {
		console.log("New Blog", newBlog.author)
		io.emit("blog", newBlog)
	})
})

const DB = process.env.DB_URL
const mongoose = require("mongoose")
const Blog = require("./models/posts")
const cors = require("cors")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors())

app.use((req, res, next) => {
	console.log(req.path, req.method)
	next()
})

mongoose
	.connect(DB)
	.then(() => {
		console.log("Connected to MongoDb Successfully")
	})
	.catch(() => {
		console.log("Error Occured when connecting to the database!")
	})

app.get("/blog", (req, res) => {
	res.status(200).render("index")
})

app.get("/blogs", async (req, res) => {
	const blogs = await Blog.find({}).sort("-createdAt")
	res.status(200).json({ data: blogs })
})

app.post("/blogs", async (req, res, next) => {
	try {
		const blog = await Blog.create(req.body)
		res.status(200).json({ data: blog })
	} catch (err) {
		next(err)
	}
})

app.all("*", (req, res) => {
	res.send("404 NOT FOUND")
})

app.use((err, req, res, next) => {
	res.status(404).json({ error: err.name })
})

const port = 3000
server.listen(port, () => {
	console.log(`Listening on Port ${port}`)
})
