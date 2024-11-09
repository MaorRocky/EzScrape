"use client";

import React from "react";
import { ParamProps } from "@/types/appNode";

function BrowserInstanceParam({ param, value, updateNodeParamValue }: ParamProps) {
  return <p className="text-xs">{param.name} </p>;
}

export default BrowserInstanceParam;
