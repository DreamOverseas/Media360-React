import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalButton from "./PayPalButton"; // Ensure correct import

const Payment = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": "AfNM7A_anHxFT40Si_q4kXgLWItc5y4kUP3qwtrW5hx9QbdUpCpIcJ16Ot_7lr6Y89GWevADtHg_kvUH" }}>
      <div>
        <h2>付款页面</h2>
        <PayPalButton amount="20.00" currency="USD" />
      </div>
    </PayPalScriptProvider>
  );
};

export default Payment;