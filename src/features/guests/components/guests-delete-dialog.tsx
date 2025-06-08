"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconAlertTriangle } from "@tabler/icons-react";
import { guestService } from "@/services/guest.service";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Guest } from "../data/schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Guest;
}

export function GuestsDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: (uid: string) => guestService.delete(uid),
    onSuccess: () => {
      guestService.delete(currentRow.uid);
      toast.success("Guest deleted successfully");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });

  const handleDelete = () => {
    if (value.trim() !== currentRow.nicCardNum) return;
    mutate(currentRow.uid);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      isLoading={isPending}
      disabled={value.trim() !== currentRow.nicCardNum}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{" "}
          Delete Guest
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{" "}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the guest with the role of from
            the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            NIC Card Number:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter NIC Card Number to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  );
}
