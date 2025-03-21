import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalButton from "./PayPalButton"; // Ensure correct import


const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
const Payment = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
      <div>
        <h2>付款页面</h2>
        <PayPalButton amount="20.00" currency="USD" />
      </div>
    </PayPalScriptProvider>
  );
};

export default Payment;