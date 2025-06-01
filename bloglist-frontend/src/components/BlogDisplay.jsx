import Blog from './Blog'

const BlogDisplay = ({
  user, 
  blogs,
  title,
  author, 
  url,
  createNewBlog,
  handleLogout,
  setTitle,
  setAuthor,
  setUrl
}) => {
  console.log("blogDisplay");
  return (<>
    <p> {user.name} logged in</p>
    <button onClick={handleLogout}>logout</button>
    {
      blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )
    }

    <h2>create new</h2>
    <form onSubmit={createNewBlog}>
      <div>
        title
        <input type="text" value={title} name="Title" onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        author
        <input type="text" value={author} name="Author" onChange={(e) => setAuthor(e.target.value)} />
      </div>

      <div>
        url
        <input type="text" value={url} name="Url" onChange={(e) => setUrl(e.target.value)} />
      </div>

      <button type="submit">add</button>
    </form>
  </>);
}

export default BlogDisplay;