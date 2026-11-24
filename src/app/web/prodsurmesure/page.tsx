import { Suspense } from "react";
import { CustomProd } from "./CustomProd";

export default function Page() {
  return (
    <Suspense>
      <CustomProd />
    </Suspense>
  );
}
