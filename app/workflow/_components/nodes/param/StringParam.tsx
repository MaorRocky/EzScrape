"use client";

import React, { useEffect, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ParamProps } from "@/types/appNode";
import { Textarea } from "@/components/ui/textarea";

function StringParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) {
  const [internalValue, setInternalValue] = useState(value);
  const id = useId();

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  let Component: any = Input;
  if (param.variant?.toLowerCase() === "textarea".toLowerCase()) {
    Component = Textarea;
  }
  return (
    <div className="space-y-1 p-1 w-full ">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-500 px-2">*</span>}
      </Label>
      <Component
        disabled={disabled}
        id={id}
        className="text-xs"
        value={internalValue}
        placeholder="Enter value here"
        onChange={(e: any) => setInternalValue(e.target.value)}
        onBlur={(e: any) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <div className="px-2 text-muted-foreground">{param.helperText}</div>
      )}
    </div>
  );
}

export default StringParam;
