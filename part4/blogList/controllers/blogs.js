const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

// get all blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

// post new blog
blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const user = request.user;

  if (!request.body.title || !request.body.url) {
    response.status(400).json({ error: "title or url is missing" });
  } else {
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);

    await user.save();
    response.status(201).json(savedBlog);
  }
});

// delete blog by id
blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const blogToDelete = await Blog.findById(request.params.id);

    if (blogToDelete.user.toString() !== user._id.toString()) {
      return response
        .status(401)
        .json({ error: "only creator can delete blog" });
    }

    if (blogToDelete) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    }
  }
);

// update like count on blog
blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);

  response.status(200).end();
});

module.exports = blogsRouter;
