import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from "./services/login";
import Notification from './components/Notifications';

import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import { BlogDisplay, AddNewBlog } from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  // check if user is present when website starts
  // if yes, then log user in 
  // NOT DESIGNED TO RUN MULTIPLE TIMES
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser');
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      console.log(user);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [])

  useEffect(() => {
    if (user !== null) {
      blogService.getAll().then(response => {
        const blogs = response.
          filter(blog => blog.user.name === user.name
            && blog.user.username === user.username)
          .sort((a, b) => b.likes - a.likes);
        setBlogs(blogs);
      })
    }
  }, [user]);

  const handleLoginBackend = async (credentials) => {
    try {
      const user = await loginService.login(credentials);

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      );

      blogService.setToken(user.token);
      setUser(user);

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

    setNotification({
      msg: 'Logged out',
      type: 'success'
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addBlogBackend = async (blog) => {
    const isNotBlank = (x) => {
      return x !== null && String(x).trim() !== "";
    }

    const { title, author, url } = blog;

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

    blog.user = user;

    const response = await blogService.create(blog);
    setBlogs(blogs.concat(response));

    setNotification({
      msg: `A new blog added: ${blog.title} by ${blog.author}`,
      type: 'success'
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification notification={notification} />
      {user === null &&
        <Togglable buttonLabel="login">
          <LoginForm handleLoginBackend={handleLoginBackend} />
        </Togglable>
      }
      {user !== null && (
        <>
          <BlogDisplay
            user={user}
            blogs={blogs}
            handleLogout={handleLogout} />

          <Togglable buttonLabel="new note">
            <AddNewBlog
              addBlogBackend={addBlogBackend} />
          </Togglable>
        </>
      )}
    </div>
  )
}


export default App