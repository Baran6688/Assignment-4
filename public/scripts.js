const form = document.querySelector("#form")
const blogsDiv = document.querySelector(".posts")
const errDiv = document.querySelector("#error")
const socket = io("ws://https://pureblogz.onrender.com/blog")

// Blogs
let blogs = []

// if any changes happened in the blogs array, then render the div again
async function renderBlogs() {
	blogsDiv.innerHTML = ""
	for (let blog of blogs) {
		blogsDiv.innerHTML += `
            <div class="card" >
                <div class="card-body">
                    <h5 class="card-title">${blog.author}</h5>
                    <p class="card-text">${blog.content}</p>
                    <small>${new Date(blog.createdAt).toLocaleString()}</small>
                </div>
            </div>
            `
	}
}

// First time opened the page, render previous blogs
async function getPosts() {
	blogsDiv.innerHTML = "Loading...."
	blogsDiv.innerHTML = ""
	const res = await fetch("/blogs")
	const { data } = await res.json()
	blogs = data
	errDiv.innerHTML = ``
	renderBlogs()
}
getPosts()

// if any blogs posted from any other user or you, this one get triggered!
socket.on("blog", newBlog => {
	blogs.unshift(newBlog)
	renderBlogs()
})

// it handles the submiting
async function handleSubmit(e) {
	e.preventDefault()

	// Getting out the values in the form
	const formData = new FormData(e.target)
	let { author, content } = Object.fromEntries(formData)

	// sending as json by POST method
	const res = await fetch("/blogs", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ author, content }),
	})

	// Reques was ok, then emit socket, and it will get the message, then rerender the messages
	if (res.ok) {
		const { data } = await res.json()
		socket.emit("blog", data)
		errDiv.innerHTML = ``
		form.reset()
	}

	// if not ok, then it shows the error
	if (!res.ok) {
		const { error } = await res.json()
		errDiv.innerHTML = `<span>${error} </span>`
	}
}

// trigger handle submit function, when the form submitted
form.addEventListener("submit", e => handleSubmit(e))
