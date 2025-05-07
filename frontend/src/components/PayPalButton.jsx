import React, { useEffect, useRef, useState } from "react";

const PayPalButton = ({ amount, onSuccess }) => {
  const paypalRef = useRef();
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    const addPayPalScript = async () => {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=AZ7KHt_WMK2jcpqYaOGJ_nrDCRomaI66T1yNzdAjnF73muDxPz2h8BtITT9r7SSRy1uHaKN6POARjqjT";
      script.async = true;
      script.onload = () => setSdkLoaded(true);
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (sdkLoaded && window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: amount,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture();
          console.log("Transaction completed by ", details.payer.name.given_name);
          onSuccess(details);
        },
        onError: (err) => {
          console.error("PayPal Button Error:", err);
        },
      }).render(paypalRef.current);
    }
  }, [sdkLoaded, amount, onSuccess]);

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;