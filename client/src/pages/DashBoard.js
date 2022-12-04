import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { FaCopy } from "react-icons/fa";
import airtime from "../images/airtime.svg";
import data from "../images/data.jpg";
import cable from "../images/cable.jpg";
import utility from "../images/utility.jpg";
import historyImage from "../images/history.png";
import withdraw from "../images/withdraw.png";
import { useGlobalContext } from "../context/UserContext";
import WarninAlert from "../components/WarningAlert";

const DashBoard = () => {
  const { user } = useGlobalContext();
  const navigate = useNavigate();

  const copyReferralLink = async () => {
    await window.navigator.clipboard.writeText(
      `https://www.datareloaded.com/register/${user.userName}`
    );
    toast.success("Referral link copied");
  };
  const copyAccNo1 = async () => {
    await window.navigator.clipboard.writeText(user.reservedAccountNo);
    toast.success("Account number copied");
  };
  const copyAccNo2 = async () => {
    await window.navigator.clipboard.writeText(user.reservedAccountNo2);
    toast.success("Account number copied");
  };
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (user.userType === "smart earner") {
      const time = Math.random() * 7000;
      setTimeout(() => {
        setShowAlert(true);
      }, [time]);
    }
    // eslint-disable-next-line
  }, []);

  const navigation = [
    { name: "Airtime", image: airtime, link: "/profile/buyairtime" },
    { name: "data", image: data, link: "/profile/buydata" },
    { name: "Tv subscription", image: cable, link: "/profile" },
    { name: "Utility", image: utility, link: "/profile/electricity" },
    { name: "History", image: historyImage, link: "/profile/transactions" },
    { name: "withdraw", image: withdraw, link: "/profile" },
  ];
  return (
    <Container>
      {showAlert && <WarninAlert close={() => setShowAlert(false)} />}
      <div className="main__container">
        <div>
          <h3 className="title text-sm font-light">
            Welcome back, {user.userName && user.userName.substring(0, 10)}
          </h3>

          {/* <div className="marquee" behavior="" direction="left">
            <p>
              <span className="text-blue-900">
                Note that Airtel CG is now ₦220/gb. Kindly reduce your price to
                maximize your sales. Thank you
              </span>
            </p>
          </div> */}
        </div>
        <div className="wallet__balance">
          <div className="balance title">
            ₦{user.balance.toFixed(2)}
            <small>({user.userType})</small>
          </div>
          <a href="#fundWallet" className="btn">
            fund wallet
          </a>
        </div>
        <section className="navigation__section">
          {navigation.map((e, index) => (
            <div
              className="each__nav"
              key={index}
              onClick={() => navigate(`${e.link}`)}
            >
              <img className="img" src={e.image} alt="airtime" />
              <p className="title service__name">{e.name}</p>
            </div>
          ))}
        </section>
        <h3 className="title">Payment account</h3>
        <div className="title-underline"></div>
        <div className="others">
          <section className="account__section " id="fundWallet">
            <div className="card">
              <h1 className="sub__title">
                Account name <br /> DataReloaded-
                {user.userName && user.userName.substring(0, 10)}
              </h1>
              <div className="content">
                <p>
                  {user.reservedAccountBank} <b>{user.reservedAccountNo}</b>{" "}
                  <FaCopy onClick={copyAccNo1} className="copy__icon" />
                </p>
                <p>
                  {user.reservedAccountBank2} <br />
                  <b>{user.reservedAccountNo2}</b>
                  <FaCopy onClick={copyAccNo2} className="copy__icon" />
                </p>
                <p className="text-sm opacity-60">
                  All payments made to the above account number will
                  automatically fund your wallet- 1.08% charges applied
                </p>
                <button
                  onClick={() => navigate("/profile/fundWallet")}
                  className="btn btn-block special__btn"
                >
                  Pay with ATM card instead
                </button>
              </div>
            </div>
          </section>
          <section className="referral__section">
            <div className="card">
              <h1 className="sub__title">refer a friend</h1>
              <div className="note">
                Refer people to DataReloaded and earn ₦500 immediately the
                person upgrade his/her account to Reseller.
              </div>
              <button className="btn special__btn" onClick={copyReferralLink}>
                Copy referral link
              </button>
              <div className="card">
                <div className="sub__title">Upgrade your account</div>
                <button
                  className="btn special__btn"
                  onClick={() => setShowAlert(true)}
                >
                  Upgrade to reseller @ ₦1000
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
};

export default DashBoard;
const Container = styled.div`
  box-shadow: var(--shadow-4);
  margin: 0 auto;
  width: 100%;
  padding-top: 5rem;
  img {
    max-width: 5rem;
  }
  .main__container {
    padding: 0.5rem;
    background-color: var(--grey-100);
  }
  .wallet__balance {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    margin-bottom: 1rem;
    max-width: 80%;
  }
  .navigation__section {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
  .each__nav {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: var(--borderRadius);
    min-width: 25%;
    box-shadow: var(--shadow-3);
    padding: 1rem;
  }
  .service__name {
    font-size: 1rem;
  }
  .others {
    @media (min-width: 800px) {
      display: flex;
      justify-content: center;
      align-items: stretch;
      height: 100%;
      min-height: 100%;
      max-width: 80%;
      margin: auto;
      section {
        width: 50%;
      }
    }
    .referral__section {
      align-self: stretch;
    }
  }

  .account__section {
    width: 100%;
    .title {
      font-size: 1.5rem;
      margin: 1rem;
    }
  }
  .card {
    max-width: 80%;
    width: 100%;
    margin: 1rem auto;
    background-color: var(--primary-600);
    color: var(--white);
    padding: 1rem;
    border-radius: var(--borderRadius);
    text-align: center;
    text-transform: uppercase;
    font-weight: 900;
    /* border: 2px solid red; */
  }
  .content {
    /* border: 2px solid red; */
    width: 100%;
    /* text-align: center; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .copy__icon {
    font-size: 1.5rem;
    margin-left: 0.5rem;
  }
  .note {
    opacity: 0.7;
  }
  .special__btn {
    background-color: var(--grey-100);
    color: var(--primary-600);
  }
  @media (min-width: 500px) {
    .navigation__section {
      display: flex;
      /* border: 2px solid red; */
    }
  }
`;
