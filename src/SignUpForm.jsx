import { useState } from "react";

const SignUpForm = ({ onSubmit, title }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      <input
        type="password"
        placeholder="Confirm Password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignUpForm;
