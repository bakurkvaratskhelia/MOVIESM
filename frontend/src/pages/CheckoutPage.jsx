import React from "react";
import PayPalButton from "../components/PayPalButton";

const CheckoutPage = () => {
  const handlePaymentSuccess = (details) => {
    alert(`Transaction completed by ${details.payer.name.given_name}`);
    console.log("Payment Details:", details);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <p>Total Amount: $20.00</p>
      <PayPalButton amount="20.00" onSuccess={handlePaymentSuccess} />
    </div>
  );
};

export default CheckoutPage;