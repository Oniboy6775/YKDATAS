import React, { useState, useEffect } from "react";
import { TableContainer } from "../Styles/Styles";
import { useNavigate } from "react-router";
import Axios from "axios";
function PriceList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [priceList, setPriceList] = useState([]);
  const fetchPriceList = async () => {
    try {
      const response = await Axios.get("/api/v1/prices");
      setPriceList(response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchPriceList();
  }, []);
  return (
    <div className=" mx-auto text-center pl-10 pb-5">
      <TableContainer className="min-h-[100vh] ">
        <button className="btn m-4" onClick={() => navigate("/profile")}>
          HOME
        </button>

        <table id="t01" className=" mx-auto md:w-[90vw]">
          <thead>
            <th>Plan id</th>
            <th>Network</th>
            <th>Volume</th>
            <th>Price</th>
            <th>Reseller</th>
            <th>API</th>
            <th>Validity</th>
            <th>Buy</th>
          </thead>
          {loading && <div className="loading mx-auto"></div>}
          {priceList.map((e) => (
            <tr
              onClick={() => {
                navigate("/profile");
              }}
              key={e.id}
            >
              <td>{e.id}</td>
              <td>
                {e.plan_network}-{e.plan_type}
              </td>
              <td>{e.plan}</td>
              <td>₦{e.my_price}</td>
              <td>₦{e.resellerPrice}</td>
              <td>₦{e.apiPrice}</td>
              <td>{e.month_validate.substring(0, 7)}</td>
              <td>
                <button
                  className="btn-hipster btn"
                  onClick={() => navigate("/profile")}
                >
                  Buy now
                </button>
              </td>
            </tr>
          ))}
        </table>
      </TableContainer>
    </div>
  );
}
export default PriceList;
