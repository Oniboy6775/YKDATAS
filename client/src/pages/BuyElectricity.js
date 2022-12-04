import React from "react";
import styled from "styled-components";
import FormInput from "../components/FormInput";
import FormRowSelect from "../components/FormRowSelect";
import { useGlobalContext } from "../context/UserContext";
import {
  Container,
  Form,
  FormContainer,
  InnerWrapper,
  Wrapper,
} from "../Styles/Styles";
const BuyElectricity = () => {
  const {
    handleChange,
    isLoading,
    isValidated,
    validatedName,
    meterNumber,
    meterToken,
    meterTypeList,
    selectedMeterType,
    validateMeter,
    electricityCompanyList,
    selectedElectricityCompany,
    amount,
    buyElectricity,
  } = useGlobalContext();
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    handleChange({ name, value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidated) {
      return buyElectricity();
    }
    validateMeter();
  };
  return (
    <Container>
      <Wrapper className="m-0 p-0">
        <FormContainer className="p-0 m-8 sm:m-0">
          <Form className="form m-0 p-0" onSubmit={handleSubmit}>
            {!isValidated ? (
              <>
                <FormRowSelect
                  labelText="Select meter type"
                  name="selectedMeterType"
                  value={selectedMeterType}
                  list={meterTypeList}
                  handleChange={handleInputChange}
                />
                <FormRowSelect
                  labelText="company"
                  name="selectedElectricityCompany"
                  value={selectedElectricityCompany}
                  list={electricityCompanyList}
                  handleChange={handleInputChange}
                />{" "}
                <FormInput
                  type="number"
                  labelText="meter number"
                  name="meterNumber"
                  value={meterNumber}
                  handleChange={handleInputChange}
                  disabled={isValidated}
                />
              </>
            ) : (
              <>
                <FormInput
                  type="number"
                  labelText="meter number"
                  name="meterNumber"
                  value={meterNumber}
                  handleChange={handleInputChange}
                  disabled={isValidated}
                />
                <FormInput
                  type="number"
                  labelText="amount"
                  name="amount"
                  value={amount}
                  handleChange={handleInputChange}
                />
              </>
            )}
            <p>You will be charged</p>
            <input
              className="form-input-disabled"
              disabled
              readOnly
              type="number"
              value={Number(amount) + 50}
            />
            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-block m-4"
            >
              {isValidated ? "buy now" : "validate meter"}
            </button>
          </Form>
        </FormContainer>
        <SubCode>
          <InnerWrapper>
            <div className="capitalize">token: {meterToken}</div>
            <div className="capitalize">meter number :{meterNumber}</div>
            <div className="capitalize">meter owner: {validatedName}</div>
          </InnerWrapper>
        </SubCode>
      </Wrapper>
    </Container>
  );
};

export default BuyElectricity;
const SubCode = styled.div`
  max-width: 40%;
  width: 100%;
  flex-shrink: 1;
  @media (max-width: 678px) {
    max-width: 100%;
  }
`;
