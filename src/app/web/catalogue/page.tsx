import { Suspense } from "react";
import { Catalogue } from "./Catalogue";

export default function Page() {
  return (
    <Suspense>
      <Catalogue />
    </Suspense>
  );
}
