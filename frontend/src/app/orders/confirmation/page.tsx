import { Suspense } from "react";
import OrderConfirmationClient from "./orderConfirmationClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationClient />
    </Suspense>
  );
}