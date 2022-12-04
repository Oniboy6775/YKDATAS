import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/UserContext";
import { Container } from "../Styles/Styles";
import EachTransaction from "../components/EachTransaction";
import FormRowSelect from "../components/FormRowSelect";
import FormInput from "../components/FormInput";
import Pagination from "../components/Pagination";

function Transactions() {
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
    numOfPages,
  } = useGlobalContext();
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (filteringTransactions) return;
    handleChange({ name, value });
  };

  useEffect(() => {
    fetchTransaction();
    // eslint-disable-next-line
  }, [page, phoneNumber, selectedTransactionFilter, userAccount]);
  return (
    <Container>
      <h4>Transactions</h4>
      <Wrapper>
        <section className="head">
          <div className="filter">
            <FormRowSelect
              name="selectedTransactionFilter"
              value={selectedTransactionFilter}
              handleChange={handleInputChange}
              labelText="filter Transaction"
              list={transactionFilterOptions}
            />
            {isAdmin && (
              <FormInput
                handleChange={handleInputChange}
                labelText="userAccount"
                name="userAccount"
                value={userAccount}
                placeholder="userName"
              />
            )}
            <FormInput
              handleChange={handleInputChange}
              labelText="phone Number"
              name="phoneNumber"
              value={phoneNumber}
              placeholder="phone number"
            />
          </div>
          <button onClick={clearFilter} className="btn btn-block btn-danger">
            Clear filters
          </button>
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
