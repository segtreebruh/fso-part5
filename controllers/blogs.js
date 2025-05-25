const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

// will setup connection path in app.js
blogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    response.json(blog);
  } catch (err) {
    next(err);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const token = request.token;
  const decodedToken = jwt.verify(
    token,
    process.env.SECRET_KEY
  );
  if (!decodedToken.id)
    return response.status(401).json({ error: "invalid token" });

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: "userId missing/invalid" });
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "Title or URL missing " });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  try {
    // save blogs to user.blogs
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const token = request.token;
  let decodedToken;
  try {
    decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY
    );
  } catch (error) {
    return next(error);
  }
  
  if (!decodedToken.id)
    return response.status(401).json({ error: "invalid token" });

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: "userId missing/invalid" });
  }

  try {
    await Blog.findByIdAndDelete(request.params.id);
     user.blogs = user.blogs.filter(b => b.toString() != request.params.id);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      updatedBlog,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (result) response.json(result);
    else response.status(404).end();
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
