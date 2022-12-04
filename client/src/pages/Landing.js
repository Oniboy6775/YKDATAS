import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoMdWifi } from "react-icons/io";
import { FiPhoneCall, FiMonitor } from "react-icons/fi";
// import { GiCutDiamond } from "react-icons/gi";
// import { RiCoinsLine, RiCoinFill } from "react-icons/ri";
import { FaClipboardList, FaUserAlt, FaLightbulb } from "react-icons/fa";
import SmallNav from "../components/SmallNav";
import LandingNav from "../components/LandingNav";
import { useGlobalContext } from "../context/UserContext";
const Landing = () => {
  const { isNavOpen, user, token } = useGlobalContext();
  const navigate = useNavigate();
  return (
    <Wrapper isNavOpen={isNavOpen}>
      <LandingNav />
      <SmallNav />
      <section>
        <div class="skewed"></div>
      </section>

      <section className="hero  md:pt-30">
        <div className="row container">
          <div className="col">
            <h1 className="title mt-8">
              {" "}
              {token ? `Hi ${user.userName}, ` : ""}Welcome to YkDatas
            </h1>
            <p className="welcome">
              A technology platform that offers solutions to digital needs at
              best possible price without compromising quality.
            </p>
            <div className="hero__btn__container">
              <button
                className="login__btn btn"
                onClick={() => navigate(`${token ? "/profile" : "/login"}`)}
              >
                <FaUserAlt />
                {token ? "Dashboard" : "Login/Register"}
              </button>
              <button
                className="price__btn btn"
                onClick={() => navigate("/priceList")}
              >
                <FaClipboardList />
                Price list
              </button>
            </div>
          </div>
          <div className="col">
            <img src="./assets/phone.svg" alt="" />
          </div>
        </div>
      </section>

      <section className="services " id="services">
        <h1 className="title">Our services</h1>
        <p className="container ">
          Below are what we offer to keep you and your loved ones connected
        </p>
        <div className="row container ">
          <div className="services__offer col">
            <div className="service">
              <div className="icon">
                <IoMdWifi className="icon" />
              </div>
              <div className="details">
                <h1>Airtime VTU</h1>
                <p>
                  Start enjoying this verMaking an online recharge has become
                  very easy and safe on DataReloaded.com
                </p>
              </div>
            </div>
            <div className="service">
              <div className="icon">
                <FiPhoneCall />
              </div>
              <div className="details">
                <h1>Cheap Data Bundle</h1>
                <p>
                  Start enjoying this very low rates Data plan for your internet
                  browsing databundle.
                </p>
              </div>
            </div>
            <div className="service">
              <div className="icon">
                <FiMonitor />
              </div>
              <div className="details">
                <h1>CableTv Subscription</h1>
                <p>
                  Enjoy an instantly activated Cable Subscriptions (Gotv, DSTV
                  and Startimes) on Datareloaded
                </p>
              </div>
            </div>
            <div className="service">
              <div className="icon">
                <FaLightbulb />
              </div>
              <div className="details">
                <h1>Bills Payment</h1>
                <p>
                  Paying for your Electricity Bills is as easy as ABC on
                  Datareloaded. Easy Process, Swift Payment with Receipt!
                </p>
              </div>
            </div>
          </div>
          <div className="col ">
            <img src="./assets/phone2.svg" alt="" />
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

export default Landing;
const Wrapper = styled.div`
  header {
    background-color: var(--primary-500);
    color: var(--white);
    padding-top: 0.5rem;
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    z-index: 1;
  }
  .nav__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  svg {
    font-size: large;
    padding-right: 0.7rem;
  }
  .big__nav {
    display: none;
  }
  .hero {
    padding-top: 5rem;
    h1 {
      text-shadow: 1px 1px 2px black;
      font-size: 2rem;
    }
  }
  .welcome {
    text-align: center;
    font-weight: 500;
    font-size: min(2vw + 1.2rem, 2.5rem);
  }
  .hero__btn__container {
    margin-bottom: 2rem;
    > button {
      padding: 1.5em;
    }
    .price__btn {
      background-color: var(--primary-400);
    }
  }
  .services {
    p {
      text-align: center;
      font-weight: 700;
      font-size: 1.3rem;
    }
  }
  .service {
    display: flex;

    justify-content: center;
    align-items: center;
  }
  .icon > * {
    font-size: 3rem;
    padding: 1rem;
  }

  .details {
    text-align: center;
    opacity: 0.9;
  }

  .price__box {
    box-shadow: var(--shadow-5);
    padding: 1rem;
    margin-bottom: 1rem;
    text-align: center;
    border-radius: 2rem;
  }
  .price__title,
  .nav__title {
    font-size: 2rem !important;
    opacity: 0.9;
  }
  .price__icon > * {
    font-size: 3rem;
  }
  .prices > * {
    font-weight: 900;
  }
  @media (min-width: 700px) {
    .nav__title {
      display: none;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
    }
    .col {
      width: 100%;
    }
    .service {
      justify-content: space-between;
    }
    .details {
      font-size: 1.2rem;
    }
  }
`;
