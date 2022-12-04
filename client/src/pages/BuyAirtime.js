import React from "react";

import { Container, FormContainer, Wrapper } from "../Styles/Styles";
import { useGlobalContext } from "../context/UserContext";
import FormInput from "../components/FormInput";
import FormRowSelect from "../components/FormRowSelect";
import { toast } from "react-toastify";

function BuyAirtime() {
  const {
    user,
    phoneNumber,
    networkList,
    selectedNetwork,
    handleChange,
    amount,
    buyAirtime,
    isLoading,
  } = useGlobalContext();
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    handleChange({ name, value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || !amount) {
      toast.warning("All fields are required");
      return;
    }
    if (phoneNumber.length !== 11) {
      toast.warning("Please enter a valid number");
      return;
    }
    if (amount < 100) {
      toast.warning("Minimum purchase is ₦100");
      return;
    }
    buyAirtime();
  };

  return (
    <Container>
      <h4 className="">purchase AIRTIME</h4>
      <Wrapper>
        <FormContainer>
          <form className="form" onSubmit={handleSubmit}>
            <FormRowSelect
              name="selectedNetwork"
              value={selectedNetwork}
              list={networkList}
              handleChange={handleInputChange}
            />
            <FormInput
              type="number"
              labelText="phone number"
              name="phoneNumber"
              value={phoneNumber}
              placeHolder="phone number"
              handleChange={handleInputChange}
            />
            <FormInput
              type="number"
              labelText="amount"
              name="amount"
              value={amount}
              placeHolder="amount"
              handleChange={handleInputChange}
            />

            <p>You will be charged</p>
            <input
              className="form-input-disabled"
              disabled
              readOnly
              type="number"
              value={
                user.userType === "reseller" ? amount * 0.975 : amount * 0.98
              }
            />
            <button
              className="btn btn-block"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "please wait" : "buy airtime"}
            </button>
          </form>
        </FormContainer>
      </Wrapper>
    </Container>
  );
}

export default BuyAirtime;
