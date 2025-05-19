import Script from "next/script";

const RazorpayScript = () => {
  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
    </div>
  );
};

export default RazorpayScript;
