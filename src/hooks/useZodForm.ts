"use client";

import { useState } from "react";
import { z } from "zod";

type Errors<T> = Partial<Record<keyof T, string>>;
type Touched<T> = Partial<Record<keyof T, boolean>>;

export function useZodForm<T extends z.ZodObject<z.ZodRawShape>>(schema: T) {
  type Values = z.infer<T>;

  const [values, setValues] = useState<Partial<Values>>({});
  const [errors, setErrors] = useState<Errors<Values>>({});
  const [touched, setTouched] = useState<Touched<Values>>({});

  const setValue = (name: keyof Values, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validateField = (name: keyof Values) => {
    const result = schema.safeParse(values);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === name);
      setErrors((prev) => ({ ...prev, [name]: issue?.message ?? "" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateAll = (): Values | null => {
    const result = schema.safeParse(values);
    if (result.success) return result.data;
    const errs: Errors<Values> = {};
    result.error.issues.forEach((i) => {
      const key = i.path[0] as keyof Values;
      if (key && !errs[key]) errs[key] = i.message;
    });
    setErrors(errs);
    return null;
  };

  const reset = () => {
    setValues({});
    setErrors({});
    setTouched({});
  };

  return { values, setValue, errors, touched, validateField, validateAll, reset };
}
