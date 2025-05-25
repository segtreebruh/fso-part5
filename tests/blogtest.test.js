const { test, describe } = require("node:test");
const assert = require("node:assert");

const {
  dummy,
  favoriteBlogs,
  totalLikes,
  mostBlogs,
  mostTotalLikes,
} = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = dummy(blogs);
  assert.strictEqual(result, 1);
});

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
];

const listWithMultipleBlogs = [
  {
    _id: "1",
    title: "Introduction to Node.js",
    author: "Alice",
    url: "https://example.com/nodejs",
    likes: 44,
    __v: 0,
  },
  {
    _id: "2",
    title: "Mastering Express.js",
    author: "Bob",
    url: "https://example.com/express",
    likes: 25,
    __v: 0,
  },
  {
    _id: "3",
    title: "Advanced MongoDB Techniques",
    author: "Charlie",
    url: "https://example.com/mongodb",
    likes: 40,
    __v: 0,
  },
  {
    _id: "4",
    title: "Understanding Mongoose",
    author: "Dana",
    url: "https://example.com/mongoose",
    likes: 17,
    __v: 0,
  },
  {
    _id: "5",
    title: "REST APIs with Express",
    author: "Charlie",
    url: "https://example.com/restapi",
    likes: 34,
    __v: 0,
  },
];


/************** total likes */
describe("total likes", () => {
  test("of empty list is zero", () => {
    assert.strictEqual(totalLikes([]), 0);
  });

  test("of only one blog", () => {
    assert.strictEqual(totalLikes(listWithOneBlog), 5);
  });

  test("of a bigger list", () => {
    assert.strictEqual(totalLikes(listWithMultipleBlogs), 160);
  });
});


/************* favorite blogs */
describe("favorite blogs", () => {
  test("of empty list is null", () => {
    assert.deepStrictEqual(favoriteBlogs([]), null);
  });

  test("of only one blog is itself", () => {
    assert.deepStrictEqual(favoriteBlogs(listWithOneBlog), listWithOneBlog[0]);
  });

  test("of a bigger list", () => {
    // default max blog to be always at the beginning
    assert.deepStrictEqual(
      favoriteBlogs(listWithMultipleBlogs),
      listWithMultipleBlogs[0]
    );
  });
});


/******************** most blogs count */
describe("most blogs", () => {
  test("of empty list is null", () => {
    assert.deepStrictEqual(mostBlogs([]), null);
  });

  test("of only one blog is itself", () => {
    const result = {
      author: listWithOneBlog[0].author,
      count: 1,
    };
    assert.deepStrictEqual(mostBlogs(listWithOneBlog), result);
  });

  test("of a bigger list", () => {
    const result = {
      author: "Charlie",
      count: 2,
    };
    assert.deepStrictEqual(mostBlogs(listWithMultipleBlogs), result);
  });
});


/***************** most total likes */
describe('most total likes', () => {
  test('of empty list is zero', () => {
    assert.deepStrictEqual(mostTotalLikes([]), null);
  });

  test("of only one blog is itself", () => {
    const result = {
      author: listWithOneBlog[0].author,
      likes: listWithOneBlog[0].likes
    };
    assert.deepStrictEqual(mostTotalLikes(listWithOneBlog), result);
  });

  test("of a bigger list", () => {
    const result = {
      author: "Charlie",
      likes: 74
    };
    assert.deepStrictEqual(mostTotalLikes(listWithMultipleBlogs), result);
  });
})

