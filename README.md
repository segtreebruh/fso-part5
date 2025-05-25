# fso-part4

Testing express servers, user administrations

##

- ALWAYS PRINT THE ENTIRE ERROR, DO NOT PRINT JUST error.message!!!!!! You can get which files that are throwing bugs!!!!
- async/await vs chaining: <https://maximorlov.com/async-await-better-than-chaining-promises/>
- use try-catch with async/await (or express-async-errors library. **WARNING: dead**) for error handling.
- package.json script:

  ```json
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development node --watch index.js",
    "test": "cross-env NODE_ENV=test node --test"
  ```

- testing:

  ```js
  npm test -- --test-name-pattern="something"
  npm test -- tests/note_api.test.js
  npm test -- --test-only
  ```

## 4.1 - 4.2

- Reorganized files in part3 according to tutorial
- Connect bloglist to mongodb: add dotenv and cors. Refactor URL to .env file
- Test connection with Restapi (NOTE: posting to localhost:3001 is enough. Do not post to MongoDB)
- Connection will break if data is in wrong format (error handling is not implemented yet)

## 4.3 - 4.7

- Pretty easy, follow tutorial
- Use hashmap for last two exercises

## 4.8 - 4.14

- Add cross-env & NODE_ENV to package file to separate production/development/test modes
- Add separate url to mongodb testing in .env file
- supertest will automatically connect to an ephemeral port if there is no connections
- blogs.includes('') must exactly match the phrase
- remove _id and __v for testing
- put request: do not use blog = new Blog({ a: "b" }), simply blog = { a: "b" } is enough. We're updating, not posting a new blog

##

- Instead of testing functions manually (w/ Postman/Restclient, etc.) now we can do automated testing (user.test.js)
- Test-driven development: tests for new functionalities are written before they are implemented, then implement code such that it passes the test, and then repeat
- Mongoose does not have a way to check uniqueness of a value $\rightarrow$ use uniqueness field instead:

  ```js
  const userSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true // this ensures the uniqueness of username
    },
    ...
  })
  ```

  However, do notice that if there is already violation in the database, **no new notes will be created**. So the database must be in a healthy state before any addition is being performed.

- To pass test create duplicate username: wrap await User.save() into a try-catch block and use next(error) on catch

- populate: equivalent to Lombok @ToString: turn all references to objects become objects themselves

##

- Bcrypt for password hashing: See controllers/users.js
- Token authorization in backend:

  ```js
  const getTokenFrom = (request) => {
    const authorization = request.get("authorization");

    if (authorization && authorization.startsWith("Bearer")) {
      return authorization.replace("Bearer ", "");
    }
  };

  //...

  blogsRouter.post("/", async (request, response, next) => {
    const body = request.body;
    const decodedToken = jwt.verify(
      getTokenFrom(request),
      process.env.SECRET_KEY
    );
    if (!decodedToken.id)
      return response.status(401).json({ error: "invalid token" });

    //...
  });
  ```

- Testing JWT authorization with Restclient:
  - Post to /api/login and get the token
  - Add

  ```rest
  Authorization: Bearer {token}
  ```

  to Restclient below Content-Type (see restclient/post.rest)

- Problems with token-based authorization:
  - Once you have the token $\rightarrow$ unlimited access. How to revoke token access?
  - Two ways:
    - 1: limit access to token

    ```js
    // controllers/login.js
    const token = jwt.sign(userForToken, process.env.SECRET_KEY, { expiresIn: 60*60 });

    // middleware.js
    ... 
    else if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
        error: 'token expired'
      })
    }
    ```

    - 2: store token in database and check if it is still valid (session-based)
  
  - **WATCH**: - <https://www.youtube.com/watch?v=fyTxwIa-1U0>

## Exercises

- 4.20: Load tokenExtractor middleware BEFORE the routes in app.js, so that it will be able to read the requests.
  - Express will handle middleware/routes sequentially, until one sends a response (stop immediately), and *next will NOT be called* (except next(error)), which means that any middleware/routes after that will also **NOT be executed**. If a middleware is placed too later in the execution chain, it might not be executed (specifically, tokenExtractor will not change request.token since it is not executed).

  ```js 
  // place getTokenFromRequests HERE (before blogsRouter)
  // or else blogsRouter will call response.send() before getTokenFromRequests is called (in fact it is not even called, which breaks blogsRouter)
  app.use(middleware.getTokenFromRequests);

  app.use("/api/login", loginRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/blogs", blogsRouter);

  app.use(middleware.unknownEndpoint);
  app.use(middleware.errorHandler);
  ```

  - However, if in the same middleware/route that call response.send(), if there is also other code after response.send() and you don't return response.send(), it will continue to run and potentially run in another response.send(), which results in "Error: Cannot set headers after they are sent to the client" (happens when attempting to send responses more than one).

  ```js
  // controller/users.js
  if (username.length <= 3 || password.length <= 3) {
    // call return here 
    // or else will raise error: cannot set headers after sent to client
    return response.status(400).json({
      error: "Username and password must be at least 3 characters"
    })

    //...
    try {
      const savedUser = await user.save();

      // if not returned above, this response.send() will also be called
      // error: cannot set headers after sent to client
      response.status(201).json(savedUser);
    } catch (error) {
      return next(error);
    }
  }
  ```

- 4.21: populate will only generate valid blogs, so in user profile, the undeleted references to blogs will not show up even if it's not actually removed from the user profile. 

  ```js
  // controller/blogs.js
  // ... 
  
  try {
    // populate will only generate valid blogs
    // so in /api/users, blogs will appear deleted in their profile but actually not 
    await Blog.findByIdAndDelete(request.params.id);

    // retain only blogs that have different id than those deleted
    user.blogs = user.blogs.filter(b => b.toString() != request.params.id);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
  ```
