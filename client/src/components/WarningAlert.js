import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGlobalContext } from "../context/UserContext";
// import useApiCall from "../../AppData/dataFetch";

function WarninAlert({ close, details }) {
  // const { upgradeUser } = useApiCall();
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();
  const { upgradeUser } = useGlobalContext();

  return (
    <Container>
      {confirm && (
        <div className="confirm">
          <TransactionDetailsContainer>
            <p className="title">Are You sure? </p>

            <p className="title">
              You will be charged a one time payment of ₦1000 for this upgrade
            </p>

            <div className="myRow">
              <button className="closeBtn btn" onClick={() => close()}>
                No
              </button>
              <button
                className="btn"
                onClick={() => {
                  close();
                  upgradeUser();
                }}
              >
                Yes pay ₦1000
              </button>
            </div>
          </TransactionDetailsContainer>
        </div>
      )}
      <TransactionDetailsContainer>
        <p className="title">
          Updgrade to a reseller and enjoy a better discount
        </p>

        <p className="title" style={{ color: "red" }}>
          You will be charged one time payment of ₦1000 for this upgrade
        </p>

        <div className="myRow">
          <button className=" btn btn-danger" onClick={() => close()}>
            Later
          </button>
          <button
            className="btn"
            onClick={() => {
              setConfirm(true);
            }}
          >
            Upgrade
          </button>
          <button
            className="btn"
            style={{ backgroundColor: "blue" }}
            onClick={() => navigate("/priceList")}
          >
            Price List
          </button>
        </div>
      </TransactionDetailsContainer>
    </Container>
  );
}

export default WarninAlert;
const Container = styled.div`
  position: fixed; /* Sit on top of the page content */
  /* display: none; Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
  display: flex;
  transition: all ease-in-out 2s;

  div > p {
    color: #000;
  }
  .confirm {
    position: fixed; /* Sit on top of the page content */
    /* display: none; Hidden by default */
    width: 100%; /* Full width (cover the whole page) */
    height: 100%; /* Full height (cover the whole page) */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
    z-index: 3; /* Specify a stack order in case you're using a different order for other elements */
    cursor: pointer; /* Add a pointer on hover */
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease-in-out 2s;
  }
`;
const TransactionDetailsContainer = styled.div`
  background-color: #fff;
  margin: auto;
  height: fit-content;
  width: fit-content;
  padding: 1rem;
  border-radius: 10px;
  transition: all ease-in-out 2s;
  overflow-y: scroll;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  button {
    padding: 0.5rem;
    margin: 0.5rem;
    border: none;
    border-radius: 0.5rem;
  }
  p {
    color: "#000";
  }
  .myRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    bottom: 0;
    @media (max-width: 578px) {
      flex-direction: column-reverse;
    }
  }
  @media (max-width: 578px) {
    width: 50vw;
  }
`;
