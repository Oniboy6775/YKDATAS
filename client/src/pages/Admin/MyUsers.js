import React, { useEffect } from "react";
import styled from "styled-components";
import FormRowSelect from "../../components/FormRowSelect";
import FormInput from "../../components/FormInput";
import Pagination from "../../components/Pagination";
import { useGlobalContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
function MyUsers() {
  const {
    fetchUser,
    adminDetails,
    page,
    phoneNumber,
    userAccount,
    userTypeOptions,
    selectedUserType,
    handleChange,
    clearFilter,
    filteringTransactions,
    totalUsers,
    changePage,
  } = useGlobalContext();
  // const [userDetails, setUserDetails] = useState({});
  const findUser = (id) => {
    // const user = allUsers.find((e) => e._id === id);
    // setUserDetails(user);
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [page, phoneNumber, userAccount, selectedUserType]);
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (filteringTransactions) return;
    handleChange({ name, value });
  };
  const handleUserTransaction = (userName) => {
    handleChange({ name: "userAccount", value: userName });
    changePage(1);
    navigate("/profile/transactions");
  };

  return (
    <Wrapper>
      <FormRowSelect
        list={userTypeOptions}
        handleChange={handleInputChange}
        labelText="user type"
        name="selectedUserType"
        value={selectedUserType}
      />
      <FormInput
        handleChange={handleInputChange}
        labelText="userAccount"
        name="userAccount"
        value={userAccount}
        placeholder="userName"
      />
      <FormInput
        handleChange={handleInputChange}
        labelText="phone Number"
        name="phoneNumber"
        value={phoneNumber}
        placeholder="phone number"
      />
      <button onClick={clearFilter} className="btn btn-block btn-danger">
        Clear filters
      </button>
      <Pagination />
      <h4 className="title">Total users :{totalUsers}</h4>
      <div className="users">
        {adminDetails.allUsers.map((e, index) => {
          const {
            fullName,
            userName,
            userType,
            balance,
            phoneNumber,
            email,
            createdAt,
            updatedAt,
            _id,
            reservedAccountBank,
            reservedAccountBank2,
            reservedAccountNo,
            reservedAccountNo2,
          } = e;
          return (
            <div className="card" key={_id}>
              <h3 className="title">{userName}</h3>
              <div className="info">
                <p>Id: {_id}</p>
                <p>Balance: #{balance.toFixed(2)}</p>
                <p>phone number: {phoneNumber}</p>
                <p>Account type: {userType}</p>
                <p>full name: {fullName}</p>
                <p>email: {email}</p>
                <p>Joined on: {createdAt}</p>
                <p>Last seen: {updatedAt}</p>
                <p>
                  {reservedAccountBank}: {reservedAccountNo}
                </p>
                <p>
                  {reservedAccountBank2}: {reservedAccountNo2}
                </p>
              </div>
              <div className="btn-container">
                <button
                  className="btn btn-hipster"
                  onClick={() => findUser(e._id)}
                  key={e._id}
                >
                  Send Email
                </button>
                <button
                  className="btn"
                  onClick={() => handleUserTransaction(e.userName)}
                >
                  Transactions
                </button>
                <button className="btn btn-danger">Delete User</button>
              </div>
            </div>
          );
        })}
      </div>
      <Pagination />
    </Wrapper>
  );
}

export default MyUsers;
const Wrapper = styled.div`
  margin-top: 4rem;
  .users {
    @media (min-width: 700px) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  .card {
    background: var(--grey-100);
    color: var(--primary-500);
    border-radius: var(--borderRadius);
    text-align: center;
    line-height: 1;
    padding: 1rem;
    max-width: 80%;
    margin: 1rem auto;
    font-size: 1rem;
  }
  .info {
    text-align: left;
    p {
      color: var(--primary-500);
      font-weight: 600;
      font-size: 0.7rem;
      text-transform: capitalize;
      line-height: 0.1;
    }
  }
`;
