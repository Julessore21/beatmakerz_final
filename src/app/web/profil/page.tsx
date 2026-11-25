import { Suspense } from "react";
import { AuthForm } from "./AuthForm";

export default function Page() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
