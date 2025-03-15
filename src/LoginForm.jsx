import { useState } from "react";

const LoginForm = ({ onSubmit, title }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Call the onSubmit function passed down as prop
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default LoginForm;
