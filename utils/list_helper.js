const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};

const favoriteBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((maxBlog, blog) =>
    blog.likes > maxBlog.likes ? blog : maxBlog
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const map = new Map();
  blogs.forEach((blog) => {
    map.set(blog.author, (map.get(blog.author) || 0) + 1);
  });

  let maxAuthor = null;
  let maxCount = 0;

  for (const [author, count] of map) {
    if (count > maxCount) {
      maxCount = count;
      maxAuthor = author;
    }
  }

  return { author: maxAuthor, count: maxCount };
};

const mostTotalLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const map = new Map();
  blogs.forEach((blog) => {
    map.set(blog.author, (map.get(blog.author) || 0) + blog.likes);
  });

  let maxAuthor = null;
  let maxLikes = 0;

  for (const [author, count] of map) {
    if (count > maxLikes) {
      maxLikes = count;
      maxAuthor = author;
    }
  }

  return { author: maxAuthor, likes: maxLikes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs,
  mostBlogs,
  mostTotalLikes,
};
