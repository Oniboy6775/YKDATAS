const {
  FETCH_ADMIN_SUCCESS,
  UPDATE_SERVICE_SUCCESS,
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

const reducer = (state, action) => {
  if (action.type === START_LOADING) {
    return { ...state, isLoading: true };
  }

  if (action.type === STOP_LOADING) {
    return { ...state, isLoading: false };
  }
  if (action.type === LOGOUT_USER) {
    return {
      ...state,
      ...action.payload,
      token: "",
      user: null,
    };
  }
  if (action.type === HANDLE_CHANGE) {
    return {
      ...state,
      [action.payload.name]: action.payload.value,
    };
  }

  if (action.type === FETCH_ADMIN_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      loadingText: "",
      showAlert: true,
      alertType: "success",
      alertText: "Admin Fetch Success",
      adminDetails: { ...action.payload.adminDetails },
    };
  }
  if (action.type === FETCH_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      adminDetails: { ...state.adminDetails, allUsers: action.payload.users },
      numOfPages: action.payload.totalPages,
      totalUsers: action.payload.totalUsers,
      totalBalance: action.payload.totalBalance,
      filteringTransactions: false,
    };
  }

  if (action.type === UPDATE_SERVICE_SUCCESS) {
    return {
      ...state,
      isLoading: false,

      showAlert: true,
      alertType: "success",
      loadingText: "service updated",
    };
  }

  if (action.type === SETUP_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      loadingText: "",
      showAlert: true,
      ...action.payload,
    };
  }

  if (action.type === HANDLE_DATA_OPTION_CHANGE) {
    return {
      ...state,
      filteredDataOptions: action.payload,
      selectedPlan: action.payload[0],
    };
  }

  if (action.type === BUY_DATA_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      loadingText: "",
      phoneNumber: "",
      transactions: [action.payload.receipt, ...state.transactions],
      user: { ...state.user, balance: action.payload.receipt.balance_After },
      // isSuccessful: true,
    };
  }

  if (action.type === BUY_AIRTIME_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      loadingText: "",
      phoneNumber: "",
      transactions: [action.payload.receipt, ...state.transactions],
      user: { ...state.user, balance: action.payload.receipt.balance_After },
      // isSuccessful: true,
    };
  }

  if (action.payload === UPGRADE_USER_SUCCESS) {
    return { ...state, isLoading: false };
  }

  if (action.type === REQUEST_PASSWORD_RESET_SUCCESS) {
    return {
      ...state,
      isLoading: false,
    };
  }
  if (action.type === RESET_PASSWORD_SUCCESS) {
    return {
      ...state,
      isLoading: false,
    };
  }

  if (action.type === FILTER_TRANSACTION_BEGIN) {
    return {
      ...state,
      filteringTransactions: true,
    };
  }
  if (action.type === FILTER_TRANSACTION_SUCCESS) {
    return {
      ...state,
      filteringTransactions: false,
      numOfPages: action.payload.totalPages,
      totalTransactions: action.payload.noOfTransaction,
      transactions: action.payload.transactions,
      totalSales: action.payload.totalSales,
      totalProfit: action.payload.totalProfit,
    };
  }
  if (action.type === CHANGE_PAGE) {
    return {
      ...state,
      page: action.payload.page,
    };
  }
  if (action.type === CLEAR_FILTER) {
    return {
      ...state,
      phoneNumber: "",
      selectedTransactionFilter: "",
      pageNumber: "1",
      page: "1",
      userAccount: "",
      transactionFrom: "",
      transactionTo: "",
      selectedTransactionStatus: "all",
    };
  }
  if (action.type === VALIDATE_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      isValidated: true,
      validatedName: action.payload,
    };
  }
  if (action.type === TRANSFER_FUND_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      isValidated: false,
      validatedName: "",
      userAccount: "",
      amount: 0,
    };
  }
  if (action.type === FUND_WALLET_COUPON) {
    return {
      ...state,
      isLoading: false,
      user: {
        ...state.user,
        balance: state.user.balance + action.payload.amount,
      },
    };
  }
  if (action.type === BUY_ELECTRICITY_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      isValidated: false,
      validatedName: "",
      amount: 0,
      meterNumber: "",
    };
  }
  if (action.type === CHANGE_PASSWORD_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      oldPassword: "",
      password: "",
      passwordCheck: "",
    };
  }
  if (action.type === GENERATE_COUPON_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      userAccount: "",
      amount: "",
      couponCode: action.payload,
      isValidated: false,
    };
  }
  if (action.type === SEND_MAIL_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      userAccount: "",
      isValidated: false,
    };
  }
  if (action.type === SELECTED_DATA_CHANGE) {
    return {
      ...state,
      selectedDataObj: action.payload,
    };
  }
  if (action.type === "TOGGLE_NAV")
    return {
      ...state,
      isNavOpen: !state.isNavOpen,
    };
  return state;
};
export default reducer;
