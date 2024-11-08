"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { router } from "next/client";
import { ChevronLeftIcon } from "lucide-react";

function Topbar() {
  return (
    <header className="flex p-2 border-b-pink-200 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeftIcon size="20" />
          </Button>
        </TooltipWrapper>
      </div>
    </header>
  );
}

export default Topbar;
