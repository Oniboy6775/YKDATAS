import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/UserContext";
import { FaCopy, FaShareAltSquare } from "react-icons/fa";
import { RiRefund2Fill } from "react-icons/ri";
import moment from "moment";
import { toast } from "react-toastify";
function TransactionDetails({ close, details }) {
  const { isAdmin, refund } = useGlobalContext();
  const handleRefund = (id) => {
    refund(id);
    close();
  };
  const {
    _id,
    balance_After,
    balance_Before,
    phone_number,
    trans_Id,
    trans_Network,
    trans_Status,
    trans_Type,
    trans_amount,
    createdAt,
  } = details;
  let date = moment(createdAt);
  date = date.format("llll");
  const detailsArray = [
    {
      name: "TRANSACTION TYPE",
      value: trans_Type,
    },
    {
      name: "Network",
      value: trans_Network,
    },
    {
      name: "Token/username",
      value: phone_number,
    },
    {
      name: "Date",
      value: date,
    },
    {
      name: "Status",
      value: trans_Status,
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
      name: "Transaction Id",
      value: trans_Id,
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
        <button className="close__btn btn btn-danger" onClick={() => close()}>
          X
        </button>
        <h1>Transaction details</h1>
        <span className="transaction__amount">
          ₦ {isBalanceIncrease ? "+" : "-"} {trans_amount}
        </span>
        {detailsArray.map((e, index) => {
          const { name, value } = e;
          return (
            <div key={index} className="trans__container">
              <div className="trans__name">{name}</div>
              <div className="trans__value">
                {value}{" "}
                {value === phone_number && (
                  <FaCopy onClick={() => copy(phone_number)} />
                )}
              </div>
            </div>
          );
        })}
        <button
          className="btn btn-danger"
          onClick={() => {
            window.print();
          }}
        >
          <FaShareAltSquare /> Share
        </button>
        {isAdmin &&
          trans_Status !== "refunded" &&
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
  padding: 1rem 2rem;
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
    color: ${({ isBalanceIncrease }) => (isBalanceIncrease ? "green" : "red")};
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
  .trans__value {
    font-weight: 700;
    font-size: 1rem;
  }
  svg {
    font-size: x-large;
  }
  button {
    margin: auto;
    margin-right: 0.5rem;
  }
`;
