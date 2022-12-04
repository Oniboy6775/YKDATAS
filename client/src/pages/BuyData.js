import React from "react";
import styled from "styled-components";

import {
  Container,
  Form,
  FormContainer,
  Wrapper,
  InnerWrapper,
} from "../Styles/Styles";

import FormRowSelect from "../components/FormRowSelect";
import FormInput from "../components/FormInput";

import { toast } from "react-toastify";
import { useGlobalContext } from "../context/UserContext";
function BuyData() {
  const {
    networkList,
    selectedNetwork,
    handleChange,
    selectedPlan,
    phoneNumber,
    buyData,
    filteredDataOptions,
    isLoading,
    selectedDataObj,
  } = useGlobalContext();

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    handleChange({ name, value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const splittedPlan = selectedNetwork.split(" ");
    if (!phoneNumber || splittedPlan[0] !== selectedNetwork) {
      toast.warning("Please provide all values");
      return;
    }
    if (phoneNumber.length !== 11) {
      toast.warning("Please enter a valid number");
      return;
    }
    buyData();
  };
  return (
    <Container>
      <h4 className="">purchase DATA</h4>

      <Wrapper>
        <FormContainer>
          <Form className="form" onSubmit={handleSubmit}>
            <FormRowSelect
              labelText="Select Network"
              name="selectedNetwork"
              value={selectedNetwork}
              list={networkList}
              handleChange={handleInputChange}
            />
            <FormRowSelect
              labelText="select Plan"
              name="selectedPlan"
              value={selectedPlan}
              list={filteredDataOptions}
              handleChange={handleInputChange}
            />
            <FormInput
              type="number"
              labelText="phone number"
              name="phoneNumber"
              value={phoneNumber}
              handleChange={handleInputChange}
            />
            <p>You will be charged</p>
            <input
              className="form-input-disabled"
              disabled
              readOnly
              type="number"
              value={selectedDataObj.my_price}
            />
            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-block"
            >
              {isLoading ? "Please wait..." : "buy now"}
            </button>
          </Form>
        </FormContainer>
        <SubCode>
          <InnerWrapper>
            <div>MTN [SME] *461*4#</div>
            <div>MTN [Gifting] *131*4# or *460*260#</div>
            <div>9mobile [Gifting] *228#</div>
            <div>Airtel *140#</div>
            <div>Glo *127*0#.</div>
          </InnerWrapper>
        </SubCode>
      </Wrapper>
    </Container>
  );
}

export default BuyData;
const SubCode = styled.div`
  max-width: 40%;
  width: 100%;
  flex-shrink: 1;
  @media (max-width: 678px) {
    max-width: 100%;
  }
`;
