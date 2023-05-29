import React, { useState } from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const [token, setToken] = useState(null); // Añade el estado del token

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  return (
    <div className="gradient h-screen">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
