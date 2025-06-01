import { useEffect, useState } from 'react';

const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>
)

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
