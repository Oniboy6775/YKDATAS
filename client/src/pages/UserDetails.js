import React from "react";
import { useGlobalContext } from "../context/UserContext";
import FormInput from "../components/FormInput";
import styled from "styled-components";
import { toast } from "react-toastify";
function UserDetails() {
  const { user } = useGlobalContext();
  const details = [
    {
      name: "Full name",
      value: user.fullName,
    },
    {
      name: "username",
      value: user.userName,
    },

    {
      name: "phone number",
      value: user.phoneNumber,
    },
    {
      name: "email",
      value: user.email,
    },
    {
      name: "API key",
      value: user.apiToken,
    },
  ];
  const copyAPIKey = async () => {
    await window.navigator.clipboard.writeText(user.apiToken);
    toast.success("Copied");
  };
  return (
    <Wrapper>
      <h4 className="title">YOUR DETAILS</h4>
      <div className=" form">
        {details.map((e, index) => {
          const { name, value } = e;
          return (
            <div className="each__detail">
              <FormInput
                key={index}
                name={name}
                placeholder={value}
                value={value}
                type="text"
                disabled={true}
              />
            </div>
          );
        })}
        <div className="btn__container">
          <button
            onClick={() => {
              window.open(
                // "https://documenter.getpostman.com/view/13986654/UV5dcti3",
                "",
                "_blank"
              );
            }}
            className="btn"
          >
            Check Developer's API
          </button>
          <button className="btn" onClick={copyAPIKey}>
            Copy API key
          </button>
        </div>
      </div>
    </Wrapper>
  );
}

export default UserDetails;
const Wrapper = styled.div`
  @media (min-width: 600px) {
    .btn__container {
      width: 100%;
      display: flex;
    }
  }
  .btn {
    margin: auto;
  }
`;
