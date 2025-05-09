import { useState } from "react";
import { loginUser, signupUser } from "../script/checkToken.js";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Input } from "antd";
import { useEffect } from "react";

export default function Login() {
  const [logState, setLogState] = useState<boolean>(true);
  const [saveUsername, setSaveUsername] = useState<string>(
    () => localStorage.getItem("save_username") || ""
  );
  const [saveEmail, setSaveEmail] = useState<string>(
    () => localStorage.getItem("save_email") || ""
  );

  useEffect(() => {
    if (saveEmail != localStorage.getItem("save_email")) {
      localStorage.setItem("save_email", saveEmail);
    }
    if (saveUsername != localStorage.getItem("save_username")) {
      localStorage.setItem("save_username", saveUsername);
    }
  }, [saveEmail, saveUsername]);

  const navigate:NavigateFunction = useNavigate();

  function emailValidation(email:string):boolean {
    if (email.length > 255) {
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async function getData(FormData:FormData): Promise<void> {
    let res;
    if (logState) {
      res = await loginUser({
        email: FormData.get("email") as string,
        password: FormData.get("password") as string,
      });
    } else {
      if (!emailValidation(FormData.get("email") as string)) {
        alert("Wrong email format");
        return;
      }
      if (FormData.get("confirm-password") !== FormData.get("password")) {
        alert("Wrong confirm password");
        return;
      } else {
        res = await signupUser({
          username: FormData.get("username") as string,
          password: FormData.get("password") as string,
          email: FormData.get("email") as string,
        });
      }
    }

    if (res) {
      navigate("/dashboard", { replace: true });
    }
  }

    const login = (
      <>
        <button type="submit">Login</button>
        <p>
          Don't have an account?{" "}
          <span onClick={() => setLogState(false)}>Signup</span>
        </p>
      </>
    );

  const signup = (
    <>
      <label>Confirm Password:</label>
      <Input type="password" name="confirm-password" required allowClear />
      <label>Username:</label>
      <Input
        type="text"
        name="username"
        value={saveUsername}
        allowClear
        required
        onChange={(e) => {
          setSaveUsername(e.target.value);
        }}
      />
      <button>Signup</button>
      <p>
        Already have an account?{" "}
        <span onClick={() => setLogState(true)}>Login</span>
      </p>
    </>
  );

  return (
    <form className="login-container" action={getData}>
      <h1>{logState ? "Login" : "Signup"}</h1>
      <label>Email:</label>
      <Input
        type="text"
        name="email"
        value={saveEmail}
        allowClear
        required
        onChange={(e) => {
          setSaveEmail(e.target.value);
        }}
      />
      <label>Password:</label>
      <Input type="password" name="password" required allowClear />
      {logState ? login : signup}
    </form>
  );
}
