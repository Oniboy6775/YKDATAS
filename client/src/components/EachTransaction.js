import React, { useState } from "react";
import TransactionDetails from "./TransactionDetails";
import { TableContainer } from "../Styles/Styles";
import moment from "moment";

function EachTransaction(props) {
  const [showDetails, setShowDetails] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({});

  return (
    <>
      {showDetails && (
        <TransactionDetails
          details={transactionDetails}
          close={() => setShowDetails(false)}
        />
      )}
      <TableContainer>
        <table id="t01">
          <tr>
            <th>Network</th>
            <th>Amount</th>
            <th>Number</th>
            <th>Date</th>
            <th>Balance Before</th>
            <th>Balance After</th>
            <th>Status</th>
          </tr>
          {props.transactions.length < 1 ? (
            <>
              <tr>
                <th>ID </th>
                <th>Network</th>
                <th>Amount</th>
                <th>Number</th>
                <th>Date</th>
                <th>Balance Before</th>
                <th>Balance After</th>
                <th>Status</th>
              </tr>

              <h2>No transaction found</h2>
            </>
          ) : (
            props.transactions.map((e) => {
              const balanceIncrease = e.balance_After > e.balance_Before;
              return (
                <tr
                  onClick={() => {
                    setShowDetails(true);
                    setTransactionDetails(e);
                  }}
                  key={e._id}
                >
                  <td>{e.trans_Network.toUpperCase()}</td>
                  <td
                    style={{
                      color: `${
                        e.balance_After < e.balance_Before ? "red" : "green"
                      }`,
                    }}
                  >{`₦
              ${e.balance_After < e.balance_Before ? "-" : "+"}${
                    e.trans_amount
                  }`}</td>

                  <td>{e.phone_number}</td>
                  <td>{moment(e.createdAt).format("llll")}</td>
                  <td>{`₦${e.balance_Before.toFixed(2)}`}</td>
                  <td>{`₦${e.balance_After.toFixed(2)}`}</td>

                  <td
                    style={{
                      color: `${balanceIncrease ? "green" : "red"}`,
                    }}
                  >
                    {e.trans_Status}
                  </td>
                </tr>
              );
            })
          )}
        </table>
      </TableContainer>
    </>
  );
}

export default EachTransaction;
