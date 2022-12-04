import React from "react";
import { useGlobalContext } from "../context/UserContext";

import { toast } from "react-toastify";
import styled from "styled-components";
import FormInput from "../components/FormInput";

function Transfer() {
  const {
    userAccount,
    handleChange,
    isValidated,
    amount,
    validateUser,
    validatedName,
    transfer,
    user,
    isAdmin,
  } = useGlobalContext();
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    handleChange({ name, value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAccount) {
      toast.warning("Enter a username");
      return;
    }
    if (user.balance < amount && !isAdmin) {
      toast.warning("Insufficient balance");
      return;
    }
    if (isValidated) {
      transfer();
      return;
    }
    validateUser();
  };

  return (
    <Wrapper>
      <h5 className="title">transfer to other user</h5>
      <form className="form" onSubmit={handleSubmit}>
        <FormInput
          placeholder="Receiver Username"
          type="text"
          name="userAccount"
          value={userAccount}
          labelText="username"
          handleChange={handleInputChange}
          disabled={isValidated}
        />
        {isValidated && (
          <FormInput
            placeholder="amount"
            type="number"
            name="amount"
            value={amount}
            labelText="amount"
            handleChange={handleInputChange}
          />
        )}

        <p>{validatedName}</p>
        <button className="btn btn-block" type="submit">
          {isValidated ? "transfer" : "validate"}
        </button>
      </form>
    </Wrapper>
  );
}
export default Transfer;
const Wrapper = styled.section``;
