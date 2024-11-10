import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import {
  FlowToExecutionPlan,
  FlowToExecutionPlanValidationError,
} from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import useFlowValidation from "@/hooks/useFlowValidation";
import { toast } from "sonner";

const UseExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback(
    (error: any) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.INVALID_OUTPUTS:
          toast.error("Not all required inputs are provided");
          setInvalidInputs(error.invalidElements);
          break;
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINTS:
          toast.error("No entry points found in the workflow");
          break;
        default:
          toast.error("Something went wrong");
          break;
      }
    },
    [setInvalidInputs]
  );

  return useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(nodes as AppNode[], edges);

    if (error) {
      handleError(error);
      return null;
    }
    clearErrors();
    return executionPlan;
  }, [toObject, clearErrors, handleError]);
};

export default UseExecutionPlan;
