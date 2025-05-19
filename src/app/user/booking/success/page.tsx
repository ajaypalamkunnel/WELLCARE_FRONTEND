import BookingConfirmation from '@/components/userComponents/BookingConfirmation';
import { Suspense } from 'react';

const Page = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <BookingConfirmation />
    </Suspense>
  );
};

export default Page;
