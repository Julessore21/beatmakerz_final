import * as React from "react";

export const ScrollArea: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className = "" }) => {
  return <div className={`overflow-y-auto ${className}`}>{children}</div>;
};
