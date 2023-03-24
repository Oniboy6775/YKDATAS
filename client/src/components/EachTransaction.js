import React, { useState } from "react";
import TransactionDetails from "./TransactionDetails";
import { TableContainer } from "../Styles/Styles";
import moment from "moment";
import { useGlobalContext } from "../context/UserContext";

function EachTransaction(props) {
  const { isAdmin, isAgent } = useGlobalContext();
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
          {props.transactions.length > 1 ? (
            <>
              <tr>
                <th>Network</th>
                <th>Status</th>
                {(isAdmin || isAgent) && <th>User</th>}
                {isAdmin && <th>Profit</th>}
                <th>Amount</th>
                <th>Number</th>
                <th>Date</th>
                <th>Balance Before</th>
                <th>Balance After</th>
              </tr>
              {props.transactions.map((e) => {
                const balanceIncrease = e.balance_After > e.balance_Before;
                return (
                  <tr
                    onClick={() => {
                      setShowDetails(true);
                      setTransactionDetails(e);
                    }}
                    key={e._id}
                  >
                    <td className="text-sm">{e.trans_Network.toUpperCase()}</td>{" "}
                    <td
                      className={
                        e.trans_Status === "success"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {e.trans_Status}
                    </td>
                    {(isAdmin || isAgent) && (
                      <td className="whitespace-nowrap">{e.trans_UserName}</td>
                    )}{" "}
                    {isAdmin && (
                      <td className="text-green-500">₦{e.trans_profit}</td>
                    )}
                    <td
                      className={`${
                        balanceIncrease ? "text-green-500" : "text-red-500"
                      }`}
                    >{`₦ ${balanceIncrease ? "+" : "-"}${e.trans_amount}`}</td>
                    <td>{e.phone_number}</td>
                    <td className="whitespace-nowrap">
                      {moment(e.createdAt).calendar()}
                    </td>
                    {/* <td>{moment(e.createdAt).format("h:mm a MMM Do ")}</td> */}
                    <td>{`₦${e.balance_Before.toFixed(2)}`}</td>
                    <td>{`₦${e.balance_After.toFixed(2)}`}</td>
                  </tr>
                );
              })}
            </>
          ) : (
            <h5 className="text-center">NO TRANSACTION FOUND</h5>
          )}
        </table>
      </TableContainer>
    </>
  );
}

export default EachTransaction;
