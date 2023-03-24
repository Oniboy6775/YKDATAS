import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/UserContext";
import { FaCopy, FaTimes } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { RiRefund2Fill } from "react-icons/ri";
import moment from "moment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function TransactionDetails({ close, details }) {
  const navigate = useNavigate();
  const { isAdmin, refund, handleChange, isAgent } = useGlobalContext();
  const handleRefund = (id) => {
    refund(id);
    close();
  };
  const buyAgain = (number) => {
    handleChange({ name: "phoneNumber", value: number });
    navigate("/profile/buydata");
  };
  const {
    _id,
    balance_After,
    balance_Before,
    phone_number,
    trans_Network,
    trans_Status,
    trans_Type,
    trans_amount,
    createdAt,
    paymentLink,
    trans_UserName,
    apiResponse,
  } = details;
  let date = moment(createdAt);
  date = date.format("llll");
  const detailsArray = [
    {
      name: "type",
      value: trans_Type,
    },
    {
      name: "Network",
      value: trans_Network,
    },
    {
      name: "response",
      value: apiResponse || `${trans_Network} ${trans_Type}`,
    },
    {
      name: "Number",
      value: phone_number,
    },
    {
      name: "Date",
      value: date,
    },
    {
      name: "Old balance",
      value: balance_Before.toFixed(2),
    },
    {
      name: "New balance",
      value: balance_After.toFixed(2),
    },
    {
      name: "User",
      value: trans_UserName,
    },
  ];
  const isBalanceIncrease = balance_After > balance_Before;
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };
  return (
    <Container>
      <TransactionDetailsContainer isBalanceIncrease={isBalanceIncrease}>
        <button className="close__btn btn btn-danger" onClick={close}>
          X
        </button>
        <h4>Transaction details</h4>
        <span
          className={`font-extrabold text-3xl ${
            isBalanceIncrease ? "text-green-700" : "text-red-500"
          }`}
        >
          ₦ {isBalanceIncrease ? "+" : "-"} {trans_amount} <br />
        </span>{" "}
        <span
          className={`capitalize font-bold ${
            trans_Status === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {trans_Status}
        </span>
        {detailsArray.map((e, index) => {
          const { name, value } = e;
          return (
            <div key={index} className="flex justify-between p-1">
              <div className="font-extrabold uppercase">{name}</div>
              <div className="font-bold capitalize text-right ">
                {value}{" "}
                {value === phone_number && (
                  <FaCopy onClick={() => copy(phone_number)} />
                )}
              </div>
            </div>
          );
        })}
        {trans_Type === "data" && (
          <button className="btn" onClick={() => buyAgain(phone_number)}>
            <TfiReload /> Buy again
          </button>
        )}
        <button className="btn btn-danger" onClick={close}>
          <FaTimes /> close
        </button>
        {paymentLink && (
          <button
            className="btn"
            onClick={() => (window.location.href = paymentLink)}
          >
            Continue payment
          </button>
        )}
        {(isAdmin || isAgent) &&
          trans_Status !== "refunded" &&
          trans_Status !== "failed" &&
          trans_Type !== "transfer" &&
          trans_Type !== "wallet" &&
          trans_Type !== "refund" && (
            <button className="btn" onClick={() => handleRefund(_id)}>
              <RiRefund2Fill /> Refund
            </button>
          )}
      </TransactionDetailsContainer>
    </Container>
  );
}

export default TransactionDetails;
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
  display: flex;
`;
const TransactionDetailsContainer = styled.div`
  margin: auto;
  background-color: var(--grey-100);
  max-height: 80vh;
  max-width: 400px;
  width: 80%;
  height: fit-content;
  padding: 1rem;
  border-radius: var(--borderRadius);
  transition: var(--transition);
  border: 2px solid var(--primary-500);
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  text-align: center;
  position: relative;
  .close__btn {
    position: absolute;
    right: 1rem;
  }
  .transaction__amount {
    font-weight: 900;
    font-size: 2rem;
    /* color: ${({ isBalanceIncrease }) =>
      isBalanceIncrease ? "green" : "red"}; */
  }
  .trans__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }
  .trans__name {
    text-transform: uppercase;
    font-weight: 900;
    min-width: fit-content;
  }

  svg {
    font-size: x-large;
  }
  button {
    margin: auto;
    margin-right: 0.5rem;
  }
`;
