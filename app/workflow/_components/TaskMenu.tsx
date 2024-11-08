"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function TaskMenu() {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data Extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}

export default TaskMenu;
