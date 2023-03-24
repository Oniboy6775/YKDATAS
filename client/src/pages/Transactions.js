import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/UserContext";
import { Container } from "../Styles/Styles";
import EachTransaction from "../components/EachTransaction";
import FormRowSelect from "../components/FormRowSelect";
import FormInput from "../components/FormInput";
import Pagination from "../components/Pagination";

function Transactions() {
  const [localSearch, setLocalSearch] = useState({
    phoneNumber: "",
    userAccount: "",
  });
  const {
    transactions,
    transactionFilterOptions,
    selectedTransactionFilter,
    handleChange,
    phoneNumber,
    filteringTransactions,
    fetchTransaction,
    page,
    clearFilter,
    userAccount,
    isAdmin,
    isAgent,
    numOfPages,
    totalSales,
    transactionFrom,
    transactionTo,
    totalProfit,
    selectedTransactionStatus,
    transactionStatusList,
  } = useGlobalContext();
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    // if (filteringTransactions) return;
    handleChange({ name, value });
  };

  useEffect(() => {
    fetchTransaction();
    // eslint-disable-next-line
  }, [
    page,
    phoneNumber,
    selectedTransactionFilter,
    userAccount,
    transactionFrom,
    transactionTo,
    selectedTransactionStatus,
  ]);
  const debounce = () => {
    let timeoutID = "";
    return (e) => {
      let name = e.target.name;
      let value = e.target.value;
      clearTimeout(timeoutID);
      setLocalSearch({ ...localSearch, [name]: value });
      timeoutID = setTimeout(() => {
        handleChange({ name, value });
      }, [2000]);
    };
  };
  const optimizedDebounce = useMemo(() => debounce(), []);
  const clearAllFilter = () => {
    setLocalSearch({ phoneNumber: "", userAccount: "" });
    clearFilter();
  };
  return (
    <Container>
      <h4 className="pt-20 mb-0">Transactions</h4>
      <Wrapper>
        <section className="head">
          <div className="filter">
            <div className="flex">
              <FormRowSelect
                name="selectedTransactionFilter"
                value={selectedTransactionFilter}
                handleChange={handleInputChange}
                labelText="Transaction type"
                list={transactionFilterOptions}
              />{" "}
              <FormRowSelect
                name="selectedTransactionStatus"
                value={selectedTransactionStatus}
                handleChange={handleInputChange}
                labelText="Transaction status"
                list={transactionStatusList}
              />{" "}
            </div>
            <div className="flex">
              <FormInput
                handleChange={handleInputChange}
                labelText="Transaction from"
                name="transactionFrom"
                value={transactionFrom}
                placeholder="from"
                type="date"
                min={transactionFrom}
                max={new Date()}
              />
              <FormInput
                handleChange={handleInputChange}
                labelText="Transaction to"
                name="transactionTo"
                value={transactionTo || new Date()}
                placeholder="to"
                type="date"
                min={transactionFrom}
                max={new Date()}
              />
            </div>
            {(isAdmin || isAgent) && (
              <FormInput
                handleChange={optimizedDebounce}
                labelText="userAccount"
                name="userAccount"
                value={localSearch.userAccount}
                placeholder="userName"
              />
            )}
            <FormInput
              handleChange={optimizedDebounce}
              labelText="phone Number"
              name="phoneNumber"
              value={localSearch.phoneNumber}
              placeholder="phone number"
            />
          </div>
          <button onClick={clearAllFilter} className="btn btn-block btn-danger">
            Clear filters
          </button>
          <h4 className="font-light">
            Total sales today:{" "}
            {totalSales >= 1000
              ? `${(totalSales / 1000).toFixed(2)}TB`
              : `${totalSales}GB`}
          </h4>
          {isAdmin && (
            <h4 className="font-light">Total profit : ₦{totalProfit || 0}</h4>
          )}
        </section>
        {numOfPages > 1 && <Pagination />}
        {filteringTransactions ? (
          <div className="loading"></div>
        ) : (
          <EachTransaction transactions={transactions} />
        )}
        {numOfPages > 1 && <Pagination />}{" "}
      </Wrapper>
    </Container>
  );
}

export default Transactions;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 3rem;
  padding-top: 1rem;
  .head {
    width: 85%;
    margin-bottom: 1rem;
  }
  @media (min-width: 600px) {
    .filter {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
  }
`;
