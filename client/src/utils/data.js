import React from "react";
import { FaHome, FaLightbulb } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";
import { BiCreditCard, BiReceipt } from "react-icons/bi";
import { RiSettings5Fill, RiRefund2Fill } from "react-icons/ri";
import { BsFillPersonFill } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";

export const sideBarButton = [
  {
    name: "Dashboard",
    url: "/profile",
    icon: <FaHome />,
  },
  {
    name: "Buy Data",
    url: "/profile/buydata",
    icon: <GiNetworkBars />,
  },
  {
    name: "Buy Airtime",
    url: "/profile/buyairtime",
    icon: <FiPhoneCall />,
  },
  {
    name: "Fund wallet",
    url: "/profile/fundWallet",
    icon: <BiCreditCard />,
  },

  {
    name: "Electricity Payment ",
    url: "/profile/electricity",
    icon: <FaLightbulb />,
  },

  // {
  //   name: "TV subscriptions",
  //   url: "/profile/tv",
  //   icon: <FiMonitor />,
  // },
  {
    name: "Transactions",
    url: "/profile/transactions",
    icon: <BiReceipt />,
  },

  {
    name: "Account",
    url: "/profile/user",
    icon: <BsFillPersonFill />,
  },
  {
    name: "Settings",
    url: "/profile/changePassword",
    icon: <RiSettings5Fill />,
  },
];
export const adminSideBarButton = [
  {
    name: "Update price",
    url: "/profile/updatePrice",
    icon: <BiCreditCard />,
  },
  {
    name: "Transfer to other User",
    url: "/profile/transfer",
    icon: <RiRefund2Fill />,
  },

  {
    name: "Send email",
    url: "/admin/sendMail",
    icon: <BsFillPersonFill />,
  },
  {
    name: "my users",
    url: "/admin/users",
    icon: <BsFillPersonFill />,
  },

  {
    name: "generate Coupon",
    url: "/admin/generateCoupon",
    icon: <RiSettings5Fill />,
  },
];
