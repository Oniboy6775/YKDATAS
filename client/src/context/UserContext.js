import React, { useContext, useReducer, useState } from "react";
import reducer from "./reducer";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const {
  FETCH_ADMIN_SUCCESS,
  UPDATE_SERVICE_SUCCESS,
  UPDATE_SERVICE_ERROR,
  SETUP_USER_SUCCESS,
  HANDLE_CHANGE,
  LOGOUT_USER,
  HANDLE_DATA_OPTION_CHANGE,
  BUY_DATA_SUCCESS,
  BUY_AIRTIME_SUCCESS,
  UPGRADE_USER_SUCCESS,
  START_LOADING,
  STOP_LOADING,
  REQUEST_PASSWORD_RESET_SUCCESS,
  RESET_PASSWORD_SUCCESS,
  CHANGE_PAGE,
  FILTER_TRANSACTION_BEGIN,
  FILTER_TRANSACTION_SUCCESS,
  CLEAR_FILTER,
  VALIDATE_SUCCESS,
  TRANSFER_FUND_SUCCESS,
  FUND_WALLET_COUPON,
  CHANGE_PASSWORD_SUCCESS,
  GENERATE_COUPON_SUCCESS,
  SEND_MAIL_SUCCESS,
  FETCH_USER_SUCCESS,
  BUY_ELECTRICITY_SUCCESS,
  SELECTED_DATA_CHANGE,
} = require("./actions");

const AppContext = React.createContext();
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
export const AppProvider = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const navigate = useNavigate();
  const initialState = {
    token: token ? token : "",
    user: user ? JSON.parse(user) : null,
    transactions: [],
    isAdmin: false,
    isCouponVendor: false,
    subscriptionPlans: {
      MTN: [],
      MTN_CG_PRICE: [],
      GLO: [],
      AIRTEL: [],
      NMOBILE: [],
      CABLETV: [],
      CABLENAME: [],
      DISCO: [],
      NETWORK: [],
    },
    // LOGIN & REGISTER
    userName: "",
    password: "",
    passwordCheck: "",
    email: "",
    amount: 0,
    userAccount: "",
    networkList: ["MTN", "GLO", "AIRTEL", "9MOBILE"],
    dataSubScriptions: [],
    selectedNetwork: "",
    dataOptions: [],
    filteredDataOptions: [],
    selectedPlan: "",
    phoneNumber: "",
    selectedDataObj: {},
    // TRANSACTIONS
    transactionFilterOptions: [
      "all",
      "airtime",
      "transfer",
      "data",
      "referrer",
      "wallet",
      "electricity",
      "cable",
    ],
    filteringTransactions: false,
    selectedTransactionFilter: "",
    numOfPages: "1",
    page: "1",
    // TRANSFER
    isValidated: false,
    validatedName: "",
    isNavOpen: false,
    isLoading: false,
    loadingText: "",
    showAlert: false,
    alertText: "",
    alertType: "",
    // ELECTRICITY
    meterTypeList: ["prepaid", "postpaid"],
    electricityCompanyList: [
      "Ikeja Electric",
      "Ibadan Electric",
      "Eko Electric",
      "Port Harcourt Electric",
      "Kaduna Electric",
      "Kano Electric",
      "Jos Electric",
      "Abuja Electric",
      "Enugu Electricity",
      "Yola Electricity",
      "Benin Electric",
    ],
    selectedElectricityCompany: "Ikeja Electric",
    selectedMeterType: "prepaid",
    meterNumber: "",
    meterToken: "",
    // ADMIN
    adminDetails: { allUsers: [], allTransactions: [], services: [] },
    userTypeOptions: ["all", "smart earner", "reseller", "api user"],
    selectedUserType: "",
    totalUsers: "",
    couponCode: "",
    totalSales: 0,
    totalProfit: 0,
    productList: ["MTN", "MTN-CG", "GLO", "AIRTEL", "9MOBILE"],
    selectedProduct: "MTN",
    transactionStatusList: [
      "all",
      "success",
      "failed",
      "processing",
      "pending",
      "refunded",
    ],
    selectedTransactionStatus: "all",
    transactionFrom: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });
  // request;

  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common["x-auth-token"] = state.token;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // response;

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response);
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );
  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };
  const toggleNav = () => dispatch({ type: "TOGGLE_NAV" });

  // LOCAL STORAGE
  const addUserToLocalStorage = ({ user, token }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.setItem("user", null);
  };
  // LOGOUT
  const logoutUser = () => {
    removeUserFromLocalStorage();
    dispatch({ type: LOGOUT_USER, payload: initialState });
  };
  // HANDLE CHANGE

  useEffect(() => {
    let currentPlan = state.dataOptions.filter((e = []) => {
      return e.split(" ")[0] === state.selectedNetwork;
    });
    dispatch({ type: HANDLE_DATA_OPTION_CHANGE, payload: currentPlan });
    // eslint-disable-next-line
  }, [state.selectedNetwork]);
  const getSelectedDataObj = (selectedPlan) => {
    const { selectedNetwork, dataSubScriptions } = state;
    const splittedPlan = selectedPlan.split(" ");
    const chosenPlan = dataSubScriptions.find((e) => {
      let dataVolume = splittedPlan[1];
      let dataType = splittedPlan[splittedPlan.length - 1];

      return (
        e.plan === dataVolume &&
        e.plan_type === dataType &&
        e.plan_network === selectedNetwork
      );
    });
    return chosenPlan;
  };
  useEffect(() => {
    if (state.selectedPlan) {
      const selectedDataObject = getSelectedDataObj(state.selectedPlan);
      dispatch({ type: SELECTED_DATA_CHANGE, payload: selectedDataObject });
    }
    // eslint-disable-next-line
  }, [state.selectedPlan]);

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const fetchAdmin = async () => {
    dispatch({ type: START_LOADING });
    try {
      const { data } = await authFetch.get("/admin/");
      dispatch({ type: FETCH_ADMIN_SUCCESS, payload: { adminDetails: data } });
    } catch (error) {
      navigate("/profile");
      dispatch({ type: STOP_LOADING });
    }
    // showAlert();
  };
  const updateService = async (serviceId) => {
    const {
      adminDetails: { services },
    } = state;
    const { serviceStatus } = services.find(
      (service) => service._id === serviceId
    );
    // dispatch({ type: UPDATE_SERVICE_BEGIN });
    try {
      await authFetch.post("/admin/updateServices", {
        serviceId: serviceId,
        serviceStatus: !serviceStatus,
      });
      dispatch({ type: UPDATE_SERVICE_SUCCESS });
      fetchAdmin();
    } catch (error) {
      dispatch({ type: UPDATE_SERVICE_ERROR });
    }
  };
  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: START_LOADING });
    try {
      const { data } = await authFetch.post(`/auth/${endPoint}`, currentUser);
      const {
        user,
        token,
        subscriptionPlans,
        transactions,
        isAdmin,
        isCouponVendor,
      } = data;
      let dataSubScriptions = subscriptionPlans["MTN"]
        .concat(subscriptionPlans["GLO"])
        .concat(subscriptionPlans["AIRTEL"])
        .concat(subscriptionPlans["NMOBILE"]);
      let dataOptions = [];
      dataOptions = dataSubScriptions.map(
        (e) =>
          `${e.plan_network} ${e.plan} ₦${e.plan_amount} ${e.month_validate} ${e.plan_type}`
      );
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: {
          user,
          token,
          alertText,
          subscriptionPlans,
          isCouponVendor,
          transactions,
          isAdmin,
          dataSubScriptions,
          dataOptions,
          selectedNetwork: dataOptions[0].split(" ")[0],
          selectedPlan: dataOptions[0],
        },
      });
      addUserToLocalStorage({ user, token });
      navigate("/profile");
    } catch (error) {
      if (error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else toast.error("Something went wrong");
      dispatch({
        type: STOP_LOADING,
      });
    }
    // clearAlert();
  };
  const checkLoggedIn = async () => {
    dispatch({ type: START_LOADING });
    try {
      const { data } = await authFetch.post("/auth/isTokenValid");
      if (data) {
        const { data } = await authFetch("/auth");
        let dataSubScriptions = data.subscriptionPlans["MTN"]
          .concat(data.subscriptionPlans["GLO"])
          .concat(data.subscriptionPlans["AIRTEL"])
          .concat(data.subscriptionPlans["NMOBILE"]);
        let dataOptions = [];
        dataOptions = dataSubScriptions.map(
          (e) =>
            `${e.plan_network} ${e.plan} ₦${e.plan_amount} ${e.month_validate} ${e.plan_type}`
        );
        dispatch({
          type: SETUP_USER_SUCCESS,
          payload: {
            ...data,
            dataSubScriptions,
            selectedNetwork: dataOptions[0].split(" ")[0],
            dataOptions,
            selectedPlan: dataOptions[0],
          },
        });
      }
    } catch (error) {
      logoutUser();
    }
  };
  // SERVICES PURCHASE
  const buyData = async () => {
    dispatch({ type: START_LOADING });
    const { phoneNumber, selectedPlan, selectedNetwork, dataSubScriptions } =
      state;
    const splittedPlan = selectedPlan.split(" ");
    // const amountToCharge = splittedPlan[2].split("₦")[1];
    let networkId;
    if (selectedNetwork === "MTN") networkId = "1";
    if (selectedNetwork === "AIRTEL") networkId = "3";
    if (selectedNetwork === "GLO") networkId = "2";
    if (selectedNetwork === "9MOBILE") networkId = "6";

    const chosenPlan = dataSubScriptions.find((e) => {
      let dataVolume = splittedPlan[1];
      let dataType = splittedPlan[splittedPlan.length - 1];

      return (
        e.plan === dataVolume &&
        e.plan_type === dataType &&
        e.plan_network === selectedNetwork
      );
    });
    const { id } = chosenPlan;
    dispatch({ type: START_LOADING });
    // console.log(chosenPlan);
    try {
      const { data } = await authFetch.post("/buy/data", {
        network: networkId,
        mobile_number: phoneNumber,
        plan: id,
      });
      dispatch({
        type: BUY_DATA_SUCCESS,
        payload: { msg: data.msg, receipt: data.receipt },
      });
      toast.success(data.msg);
      navigate("/profile");
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.msg);
    }
  };
  const buyAirtime = async () => {
    dispatch({ type: START_LOADING });
    const { selectedNetwork, phoneNumber, amount } = state;
    let networkId;
    if (selectedNetwork === "MTN") networkId = "1";
    if (selectedNetwork === "GLO") networkId = "2";
    if (selectedNetwork === "AIRTEL") networkId = "3";
    if (selectedNetwork === "9MOBILE") networkId = "4";
    try {
      const { data } = await authFetch.post("/buy/airtime", {
        network: networkId,
        mobile_number: phoneNumber,
        amount: amount,
      });
      dispatch({
        type: BUY_AIRTIME_SUCCESS,
        payload: { receipt: data.receipt, msg: data.msg },
      });
      toast.success(data.msg);
      navigate("/profile");
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.msg);
    }
  };
  // OTHERS

  const fundWalletCoupon = async () => {
    dispatch({ type: START_LOADING });
    try {
      const { data } = await authFetch.post("/fundWallet/coupon", {
        userName: state.user.userName,
        coupon: state.couponCode,
      });
      const { msg, amount } = data;
      dispatch({ type: FUND_WALLET_COUPON, payload: { amount } });
      toast.success(msg);
      navigate("/profile");
    } catch (e) {
      toast.error(e.response.data.msg);
      dispatch({ type: STOP_LOADING });
    }
  };

  const updatePrice = async (payload) => {
    dispatch({ type: START_LOADING });
    const {
      selectedDataObj: { _id },
    } = state;
    try {
      const { data } = await authFetch.post(`/admin/updatePrice`, {
        newPrice: payload,
        dataId: _id,
      });
      toast.success(data.msg);
      checkLoggedIn();
    } catch (error) {
      toast.error("something went wrong");
      dispatch({ type: STOP_LOADING });
    }
  };
  const upgradeUser = async () => {
    dispatch({ type: START_LOADING });
    const { user } = state;
    if (user.balance < 1000) {
      return toast.error("Insufficient balance");
    }
    try {
      const { data } = await authFetch.patch(`/auth/${user._id}`, {
        userType: "reseller",
      });
      dispatch({ type: UPGRADE_USER_SUCCESS });
      toast.success(data.msg);
      navigate("/");
      logoutUser();
    } catch (error) {
      toast.error("something went wrong");
      dispatch({ type: STOP_LOADING });
    }
  };
  const requestPasswordReset = async () => {
    dispatch({ type: START_LOADING });
    const { email } = state;
    try {
      const { data } = await authFetch.post("/auth/requestPasswordReset", {
        email,
      });
      toast.success(data.msg);
      dispatch({ type: REQUEST_PASSWORD_RESET_SUCCESS });
    } catch (error) {
      toast.error(error.response.data.msg);
      dispatch({ type: STOP_LOADING });
    }
  };
  const resetPassword = async ({ token, userId }) => {
    dispatch({ type: START_LOADING });
    const { password, passwordCheck } = state;
    try {
      const { data } = await authFetch.post("/auth/resetpassword", {
        token,
        userId,
        newPassword: password,
        newPasswordCheck: passwordCheck,
      });
      navigate("/");
      dispatch({ type: RESET_PASSWORD_SUCCESS });
      toast.success(data.msg);
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.msg);
    }
  };
  const changePage = async (page) => {
    dispatch({
      type: CHANGE_PAGE,
      payload: { page },
    });
  };
  const fetchTransaction = async () => {
    const {
      isAdmin,
      isAgent,
      phoneNumber,
      selectedTransactionFilter,
      page,
      userAccount,
      transactionFrom,
      transactionTo,
      selectedTransactionStatus,
    } = state;
    let endPoint = "/transaction?";
    if (phoneNumber) {
      endPoint = `${endPoint}phoneNumber=${phoneNumber}`;
      // changePage(1);
    }
    if ((userAccount && isAdmin) || isAgent)
      endPoint = endPoint + `&userName=${userAccount}`;
    if (selectedTransactionFilter && selectedTransactionFilter !== "all") {
      endPoint = endPoint + `&type=${selectedTransactionFilter}`;
    }
    if (page) endPoint = endPoint + `&page=${page}`;
    if (selectedTransactionStatus)
      endPoint = endPoint + `&status=${selectedTransactionStatus}`;
    if (transactionFrom) {
      endPoint =
        endPoint +
        `&from=${transactionFrom}` +
        `&to=${transactionTo || new Date()}`;
    }

    dispatch({ type: FILTER_TRANSACTION_BEGIN });
    try {
      const { data } = await authFetch(endPoint);
      const {
        noOfTransaction,
        transactions,
        totalPages,
        totalSales,
        totalProfit,
      } = data;
      dispatch({
        type: FILTER_TRANSACTION_SUCCESS,
        payload: {
          transactions,
          noOfTransaction,
          totalPages,
          totalSales,
          totalProfit,
        },
      });
    } catch (error) {
      // dispatch({ type: STOP });
    }
  };
  const changePassword = async () => {
    dispatch({ type: START_LOADING });
    const { password, passwordCheck, oldPassword } = state;
    try {
      const { data } = await authFetch.post("/auth/changepassword", {
        oldPassword: oldPassword,
        newPassword: password,
        newPasswordCheck: passwordCheck,
      });
      dispatch({ type: CHANGE_PASSWORD_SUCCESS });
      toast.success(data.msg);
      navigate("/profile");
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.msg);
    }
  };

  // ADMIN

  const fetchUser = async () => {
    const { isAdmin, phoneNumber, userAccount, selectedUserType, page } = state;
    let endPoint = "/admin/users?";
    if (!isAdmin) return;
    if (phoneNumber) {
      endPoint = `${endPoint}phoneNumber=${phoneNumber}`;
    }
    if (userAccount && isAdmin)
      endPoint = endPoint + `&userName=${userAccount}`;
    if (selectedUserType && selectedUserType !== "all") {
      endPoint = endPoint + `&type=${selectedUserType}`;
    }
    if (page) endPoint = endPoint + `&page=${page}`;
    dispatch({ type: FILTER_TRANSACTION_BEGIN });
    try {
      const { data } = await authFetch(endPoint);
      // console.log(data);
      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: {
          users: data.users,
          totalUsers: data.totalUsers,
          totalPages: data.totalPages,
          totalBalance: data.totalBalance,
        },
      });
    } catch (error) {
      // dispatch({ type: STOP });
    }
  };
  const validateMeter = async () => {
    dispatch({ type: START_LOADING });
    const {
      meterNumber,
      selectedElectricityCompany,
      selectedMeterType,
      electricityCompanyList,
    } = state;
    const selectedIndex = electricityCompanyList.indexOf(
      selectedElectricityCompany
    );
    const availablePlanId = {
      0: 18,
      1: 19,
      2: 20,
      3: 21,
      4: 22,
      5: 23,
      6: 24,
      7: 25,
      8: 26,
      9: 28,
      10: 29,
    };

    try {
      const { data } = await authFetch.post(`/buy/validateMeter`, {
        meterNumber,
        meterId: availablePlanId[selectedIndex],
        meterType: selectedMeterType,
      });
      dispatch({ type: VALIDATE_SUCCESS, payload: data.name });
      toast.success(data.name);
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.name);
    }
  };
  const buyElectricity = async () => {
    const {
      meterNumber,
      selectedElectricityCompany,
      selectedMeterType,
      electricityCompanyList,
      amount,
    } = state;
    const selectedIndex = electricityCompanyList.indexOf(
      selectedElectricityCompany
    );
    const availablePlanId = {
      0: 18,
      1: 19,
      2: 20,
      3: 21,
      4: 22,
      5: 23,
      6: 24,
      7: 25,
      8: 26,
      9: 28,
      10: 29,
    };
    dispatch({ type: START_LOADING });
    try {
      const { data } = await authFetch.post(`/buy/electricity`, {
        amount,
        meterId: availablePlanId[selectedIndex],
        meterNumber,
        meterType: selectedMeterType,
      });
      toast.success(data.msg);
      dispatch({ type: BUY_ELECTRICITY_SUCCESS });
      navigate("/profile");
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.msg);
    }
  };
  const sendEmail = async (payload) => {
    const { userAccount } = state;
    dispatch({ type: START_LOADING });
    try {
      const { data } = await authFetch.post("/admin/sendMail", {
        ...payload,
        userAccount,
      });
      dispatch({ type: SEND_MAIL_SUCCESS });
      toast.success(data.msg);
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.msg);
    }
  };
  const refund = async (transId) => {
    if (!transId) return;
    dispatch({ type: START_LOADING });
    try {
      const { data } = await authFetch.post(`/admin/refund/${transId}`, {});
      fetchTransaction();
      toast.success(data.msg);
      dispatch({ type: STOP_LOADING });
    } catch (error) {
      dispatch({ type: START_LOADING });
    }
  };
  const validateUser = async () => {
    dispatch({ type: START_LOADING });
    const { userAccount } = state;
    try {
      const { data } = await authFetch.get(`/auth/validateUser/${userAccount}`);
      dispatch({ type: VALIDATE_SUCCESS, payload: data.msg });
      toast.success(data.msg);
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.msg);
    }
  };
  const transfer = async () => {
    dispatch({ type: START_LOADING });
    const { userAccount, amount } = state;
    try {
      const { data } = await authFetch.post("/auth/transferFund", {
        userName: userAccount,
        amount,
      });
      dispatch({ type: TRANSFER_FUND_SUCCESS });
      toast.success(data.msg);
      navigate("/profile");
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.msg);
    }
  };

  const generateCoupon = async () => {
    const { userAccount, amount } = state;
    dispatch({ type: START_LOADING });
    try {
      const { data } = await authFetch.post("/admin/generateCoupon", {
        userAccount,
        amount,
      });
      dispatch({ type: GENERATE_COUPON_SUCCESS, payload: data.couponCode });
      toast.success(data.couponCode);
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.msg);
    }
  };
  const updateCostPrice = async (costPrice) => {
    dispatch({ type: START_LOADING });
    try {
      const { data } = await authFetch.post("/admin/costPrice", {
        network: state.selectedProduct,
        costPrice,
      });
      dispatch({
        type: STOP_LOADING,
      });
      toast.success(data.msg);
    } catch (error) {
      dispatch({ type: STOP_LOADING });
      toast.error(error.response.data.msg);
    }
  };
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        isSideBarOpen,
        setIsSideBarOpen,
        toggleSideBar,
        setupUser,
        toggleNav,
        fetchAdmin,
        updateService,
        handleChange,
        logoutUser,
        checkLoggedIn,
        buyData,
        buyAirtime,
        buyElectricity,
        upgradeUser,
        requestPasswordReset,
        resetPassword,
        changePage,
        fetchTransaction,
        clearFilter,
        validateUser,
        transfer,
        fundWalletCoupon,
        changePassword,
        generateCoupon,
        sendEmail,
        fetchUser,
        refund,
        validateMeter,
        updatePrice,
        updateCostPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(AppContext);
};
