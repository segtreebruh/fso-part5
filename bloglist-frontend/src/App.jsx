import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from "./services/login";
import { jwtDecode }from 'jwt-decode'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    if (user !== null) {
      console.log("funny")
      const token = user.token;
      const decodedToken = jwtDecode(token);
      const id = decodedToken.id;

      blogService.getAll(id).then(user => setBlogs(user.blogs));
    }
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  };

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
    console.log(user);

    return (<>
      <h2>blogs</h2>
      <p> {user.name} logged in</p>
      {
        blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )
      }
    </>);
  }

  return (
    <div>
      {user === null
        ? loginForm()
        : blogDisplay()
      }
    </div>
  )
}

export default App