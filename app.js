const express = require("express")
const ejs = require("ejs")
const _ = require("lodash")
const mongoose = require("mongoose")

const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))

mongoose.connect(
  "mongodb+srv://admin:GSTZMGT2h787TsLk@node-mongodb.ptcuv7r.mongodb.net/blogDB?retryWrites=true&w=majority"
)

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
})

const defaultContentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
})

const Post = new mongoose.model("Post", postSchema)
const DefaultContent = new mongoose.model(
  "DefaultContent",
  defaultContentSchema
)

app.get("/", async (req, res) => {
  const home = await DefaultContent.findOne({ title: "Home" })
  const posts = await Post.find()
  res.render("home", { startingContent: home.content, posts: posts })
})

app.get("/about", async (req, res) => {
  const about = await DefaultContent.findOne({ title: "About" })
  res.render("about", { content: about.content })
})

app.get("/contact", async (req, res) => {
  const contact = await DefaultContent.findOne({ title: "Contact" })
  res.render("contact", { content: contact.content })
})

app.get("/compose", (req, res) => {
  res.render("compose")
})

app.get("/posts/:postId", async (req, res) => {
  const requestedPost = req.params.postId

  const postFound = await Post.findOne({ _id: requestedPost })
  res.render("post", {
    postTitle: postFound.title,
    postBody: postFound.content,
  })
})

app.post("/compose", (req, res) => {
  const post = Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  })

  post.save()
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000")
})
