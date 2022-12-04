import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useGlobalContext } from "../context/UserContext";

const SmallNav = () => {
  const { toggleNav, isNavOpen } = useGlobalContext();
  const nav = [
    { name: "home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "register ", path: "/register" },
    { name: "price list", path: "/pricelist" },
  ];
  return (
    <Container isNavOpen={isNavOpen}>
      <div className="my_nav__container  bg-white">
        <section className="flex justify-between items-center w-[100%]">
          <div className="logo img">
            <img src="./assets/logo.png" alt="" />
          </div>
          <div
            className="bg-red-500 rounded-full p-2 text-white grid item-center text-center"
            onClick={() => toggleNav()}
          >
            <FaTimes className="pl-1" />
          </div>
        </section>
        <div className="flex flex-col m-auto ">
          {nav.map((e, index) => {
            return (
              <NavLink
                to={e.path}
                key={index}
                onClick={toggleNav}
                className={({ isActive }) =>
                  isActive ? "nav__btn active " : "nav__btn"
                }
              >
                {e.name}
              </NavLink>
            );
          })}
        </div>{" "}
      </div>
    </Container>
  );
};

export default SmallNav;
const Container = styled.div`
  display: ${({ isNavOpen }) => (isNavOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;

  .my_nav__container {
    margin: auto;
    max-width: 500px;
    width: 80%;
    padding: 0.5rem 1rem;
    background-color: var(--white);
    border-radius: 1rem;
  }

  .nav__links {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    * {
      background-color: var(--primary-300);
      color: var(--white);
      padding: 1rem;
      border-radius: 1rem;
      margin-bottom: 1rem;
      width: 50%;
      text-align: center;
      text-transform: uppercase;
    }
  }

  .active {
    border-bottom: 2px solid var(--primary-300);
  }
  .nav__btn {
    padding: 0.4rem 0.2rem;
    text-transform: capitalize;

    &:hover {
      background: var(--primary-100);
      border-radius: 5px;
    }
  }
`;
