import { useState } from "react";

const LoginForm = ({ handleLoginBackend }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginFrontend = async (event) => {
    event.preventDefault();

    const credentials = {
      username, password
    };

    await handleLoginBackend(credentials);
  };

  return (
    <>
      <form onSubmit={handleLoginFrontend}>
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
    </>
  );
};

export default LoginForm;