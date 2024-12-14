"use client";

import React, { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layers2Icon, Loader2, ShieldEllipsisIcon } from "lucide-react";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { createWorkflowSchema, CreateWorkflowSchemaType } from "@/schema/workflows";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { createWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";
import { createCredentialSchema, CreateCredentialSchemaType } from "@/schema/credential";
import { CreateCredential } from "@/actions/credentials/createCredential";

function CreateCredentialDialog({ triggerText }: { triggerText?: string }) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success("Credential created successfully", { id: "create-credential" });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create Credential", { id: "create-credential" });
      console.error(error);
    },
  });

  const onSubmit = useCallback(
    (values: CreateCredentialSchemaType) => {
      toast.loading("Creating Credential...", { id: "create-credential" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader icon={ShieldEllipsisIcon} title="Create Credential" />
        <div className="p-6">
          <Form {...form}>
            <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-sm text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter a unique name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}></FormField>

              <FormField
                name="value"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Value
                      <p className="text-primary text-xs">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the value for this credentials <br /> this value will be securely
                      encrypted
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}></FormField>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Proceed"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCredentialDialog;
