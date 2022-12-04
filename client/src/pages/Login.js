import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import FormInput from "../components/FormInput";
import { useGlobalContext } from "../context/UserContext";

function Login() {
  const { setupUser, handleChange, userName, password, isLoading } =
    useGlobalContext();
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    handleChange({ name, value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !userName) return toast.warning("All field are required");
    let currentUser = { password, userName };
    setupUser({ currentUser, endPoint: "login" });
  };
  return (
    <Container>
      <Wrapper>
        <button onClick={() => navigate("/")} className="home__btn btn">
          <FaHome />
        </button>
        <h1 className="title">LOGIN</h1>
        <form onSubmit={handleSubmit}>
          {/* {isTransacting && <PleaseWait />} */}
          <FormInput
            name="userName"
            value={userName}
            placeholder="username/email/business name"
            type="userName"
            handleChange={handleInputChange}
            labelText="username/email/business name"
          />
          <FormInput
            name="password"
            value={password}
            placeholder="password"
            type="password"
            handleChange={handleInputChange}
            labelText="password"
          />
          <button type="submit" className="btn" disabled={isLoading}>
            <FaUserAlt />
            {isLoading ? " please wait.." : " Login"}
          </button>
          <div className="new__user">
            <p>New user?</p>
            <button
              className="register__btn btn"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </button>
          </div>
          <button
            className="btn btn-hipster"
            onClick={() => navigate("/requestPasswordReset")}
          >
            Reset my password
          </button>
        </form>
      </Wrapper>
    </Container>
  );
}

export default Login;

export const Container = styled.div`
  padding: 3rem 0;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  background-color: var(--grey-500);
`;
export const Wrapper = styled.div`
  text-align: center;
  margin: auto;
  max-width: 400px;
  max-height: fit-content;
  padding: 1rem;
  width: 80%;
  background-color: var(--grey-100);
  border-radius: var(--borderRadius);
  position: relative;
  .logo {
    position: absolute;
    left: 1rem;
    border-radius: 100px;
  }
  .home__btn {
    position: absolute;
    right: 1rem;
  }
  .title {
    font-weight: 900;
    text-align: center;
    margin: 2rem auto 1rem;
  }
  .new__user {
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--primary-800);
    }
  }
  .register__btn {
    background-color: var(--red-dark);
    padding: 0.5rem;
  }
`;
