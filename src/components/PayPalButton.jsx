import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const client_id = import.meta.env.VITE_PAYPAL_CLIENT_ID
const PayPalButton = ({ amount, currency }) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": client_id,
        currency: currency || "USD", // Ensure the currency is passed here
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount, // 付款金额
                  currency_code: currency || "USD", // Ensure the currency matches
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            alert(`付款成功，感谢 ${details.payer.name.given_name}！`);
          });
        }}
        onError={(err) => {
          console.error("PayPal 付款失败：", err);
          alert("付款失败，请重试！");
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;