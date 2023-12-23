const express = require("express")
const app = express()
const path = require("path")

app.get("/blog", (req, res) => {
	res
		.status(200)
		.type("html")
		.sendFile("index.html", { root: path.join(__dirname, "views") })
})

const port = 3000
app.listen(port, () => {
	console.log(`Listening on Port ${port}`)
})
