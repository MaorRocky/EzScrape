"use client";

import React, { useEffect, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ParamProps } from "@/types/appNode";

function StringParam({ param, value, updateNodeParamValue }: ParamProps) {
  const [internalValue, setInternalValue] = useState(value);
  const id = useId();

  useEffect(() => {
    console.log("StringParam useEffect", value);

    setInternalValue(value);
  }, [value]);

  return (
    <div className="space-y-1 p-1 w-full ">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-500 px-2">*</span>}
      </Label>
      <Input
        id={id}
        className="text-xs"
        value={internalValue}
        placeholder="Enter value here"
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={() => updateNodeParamValue(internalValue)}
      />
      {param.helperText && (
        <div className="px-2 text-muted-foreground">{param.helperText}</div>
      )}
    </div>
  );
}

export default StringParam;
