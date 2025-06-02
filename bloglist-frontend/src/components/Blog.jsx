import { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog }) => {
  const [display, setDisplay] = useState(false);
  const [localBlog, setLocalBlog] = useState(blog);
  const [deleted, setDeleted] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const increaseLike = () => {
    const newBlog = {
      ...localBlog,
      likes: localBlog.likes + 1,
      user: localBlog.user.id
    };

    setLocalBlog({
      ...localBlog,
      likes: localBlog.likes + 1
    });

    blogService.update(blog.id, newBlog);
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${localBlog.title} by ${localBlog.author}?`)) {
      blogService.remove(localBlog.id);

      setDeleted(true);
    }
  }

  if (deleted) return null;

  return (
    <div style={blogStyle}>
      {localBlog.title} {localBlog.author}
      {display === false && (
        <button onClick={(e) => setDisplay(true)}>show</button>
      )}
      {display === true && (
        <div>
          <button onClick={(e) => setDisplay(false)}>hide</button>
          <div>
            <p>{blog.url}</p>
            <p>
              likes {localBlog.likes}
              <button onClick={increaseLike}>like</button>
            </p>
            <p> {localBlog.user?.name} </p>
            <button onClick={deleteBlog}>delete</button>
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
