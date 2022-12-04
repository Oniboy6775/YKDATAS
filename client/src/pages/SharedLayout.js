import React, { useState } from "react";
import styled from "styled-components";
import SideMenu from "../components/SideMenu";
import ProfileHeader from "../components/ProfileHeader";
import { Outlet } from "react-router-dom";
import { useGlobalContext } from "../context/UserContext";

function Profile() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { isSideBarOpen } = useGlobalContext();
  return (
    <Container>
      <ProfileHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroWrapper isSideBarOpen={isSideBarOpen}>
        <SideMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className="main__menu">
          <Outlet />
        </div>
      </HeroWrapper>
    </Container>
  );
}

export default Profile;
const Container = styled.div`
  height: 100vh;
  margin: auto;
  background-color: hsl(0, 19%, 89%);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 50px);
  overflow-y: scroll;
`;
const HeroWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  /* width: 100%; */
  .main__menu {
    /* margin: 0 auto; */
    width: 100%;
    padding: 1rem;
    /* border: 2px solid red; */
    /* overflow-x: hidden; */
  }
`;
