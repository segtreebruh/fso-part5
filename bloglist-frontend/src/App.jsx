import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from "./services/login";
import Notification from './components/notifications';
import { jwtDecode } from 'jwt-decode'

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [notification, setNotification] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  // check if user is present when website starts
  // if yes, then log user in 
  // NOT DESIGNED TO RUN MULTIPLE TIMES
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser');
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [])

  useEffect(() => {
    if (user !== null) {
      const token = user.token;
      const decodedToken = jwtDecode(token);
      const id = decodedToken.id;

      blogService.getByUser(id).then(response => setBlogs(response.blogs));
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');

      setNotification({
        msg: 'Logged in',
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification({
        msg: 'Invalid credentials',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
    setBlogs([]);
    blogService.setToken(null);
    setTitle('');
    setAuthor('');
    setUrl('');

    setNotification({
      msg: 'Logged out',
      type: 'success'
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const createNewBlog = async (event) => {
    event.preventDefault();

    const blog = {
      title: title,
      author: author,
      url: url,
      user: user
    };

    const isNotBlank = (x) => {
      return x !== null && String(x).trim() !== "";
    }

    if (![title, author, url].every(isNotBlank)) {
      setNotification({
        msg: 'All fields must be filled',
        type: 'error'
      });
      setTimeout(() => {
        setNotification(null)
      }, 5000);
      return; // Exit the function early
    }


    blogService.create(blog).then(response => {
      setBlogs(blogs.concat(response));
      setTitle('');
      setAuthor('');
      setUrl('');
    })

    setNotification({
      msg: `A new blog added: ${blog.title} by ${blog.author}`,
      type: 'success'
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input type="text" value={username} name="Username" onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div>
        password
        <input type="password" value={password} name="Passowrd" onChange={(e) => setPassword(e.target.value)} />
      </div>

      <button type="submit">login</button>
    </form>
  )

  const blogDisplay = () => {
    console.log("blogDisplay");
    return (<>
      <p> {user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <h2>blogs</h2>
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

  return (
    <div>
      <Notification notification={notification} />
      {user === null && loginForm()}
      {user !== null && blogDisplay()}
    </div>
  )
}


export default App