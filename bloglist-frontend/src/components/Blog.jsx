import { useEffect, useState } from 'react';

const Blog = ({ blog }) => {
  const [display, setDisplay] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      {display === false && (
        <button onClick={(e) => setDisplay(true)}>show</button>
      )}
      {display === true && (
        <div>
          <button onClick={(e) => setDisplay(false)}>hide</button>
          <div>
            <p>{blog.url}</p>
            <p>
              likes {blog.likes}
              <button>like</button>
            </p>
            <p> {blog.user?.name} </p>
          </div>
        </div>
      )}
    </div>
  );
}

const BlogDisplay = ({
  user,
  blogs,
  handleLogout
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
  </>);
}

const AddNewBlog = ({ addBlogBackend }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();

    const blog = {
      title: title,
      author: author,
      url: url
    };

    await addBlogBackend(blog);

    setTitle('');
    setAuthor('');
    setUrl('');
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
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

export { AddNewBlog, BlogDisplay };
