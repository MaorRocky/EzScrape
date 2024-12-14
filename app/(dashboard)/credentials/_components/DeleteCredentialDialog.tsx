"use client";

import React, { Suspense, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { deleteWorkflow } from "@/actions/workflows/deleteWorkflow";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { DeleteCredential } from "@/actions/credentials/deleteCredential";

interface Props {
  name: string;
}

function DeleteCredentialDialog({ name }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const deleteMutation = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success("Credential, deleted successfully", { id: name });
      setConfirmationText("");
    },
    onError: () => {
      toast.error("Something went wrong", { id: name });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <XIcon size="20" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this credential?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
            <div className="flex flex-col py-4 gap-2">
              <p className="">
                If you are sure enter <b>{name}</b> to confirm
              </p>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel color="red" onClick={() => setConfirmationText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={confirmationText !== name || deleteMutation.isPending}
            onClick={(e) => {
              toast.loading("Deleting credential...", { id: name });
              deleteMutation.mutate(name);
            }}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCredentialDialog;
