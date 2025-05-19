import PaymentSuccessPage from '@/components/userComponents/PaymentSuccessPage';
import { Suspense } from 'react';

const Page = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PaymentSuccessPage/>
    </Suspense>
  );
};

export default Page;
