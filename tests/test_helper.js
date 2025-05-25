const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Introduction to Node.js",
    author: "Alice",
    url: "https://example.com/nodejs",
    likes: 44,
    __v: 0,
  },
  {
    title: "Mastering Express.js",
    author: "Bob",
    url: "https://example.com/express",
    likes: 25,
    __v: 0,
  },
  {
    title: "Advanced MongoDB Techniques",
    author: "Charlie",
    url: "https://example.com/mongodb",
    likes: 40,
    __v: 0,
  },
  {
    title: "Understanding Mongoose",
    author: "Dana",
    url: "https://example.com/mongoose",
    likes: 17,
    __v: 0,
  },
  {
    title: "REST APIs with Express",
    author: "Charlie",
    url: "https://example.com/restapi",
    likes: 34,
    __v: 0,
  },
];

const newBlog = {
  title: "Go To Statement Considered Harmful",
  author: "Edsger W. Dijkstra",
  url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
  likes: 5,
};

const blogWithoutLikes = {
  title: "Shortest Path",
  author: "Edsger W. Dijkstra",
  url: "https://abc.xyz.def",
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: "garbage blog value ",
    url: "https:///123456",
    author: "abcabcabc",
    likes: 1234,
  });

  await blog.save();
  await blog.deleteOne();

  return blog.title.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});

  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  newBlog,
  nonExistingId,
  blogsInDb,
  blogWithoutLikes,
  usersInDb,
};
