"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { IconAlertTriangle } from "@tabler/icons-react";
import { guestService } from "@/services/guest.service";
import { toast } from "sonner";
import { useGuestStore } from "@/stores/guestStore";
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

  const { deleteGuest } = useGuestStore((state) => state.guest);

  const deleteMutation = useMutation({
    mutationFn: (uid: string) => guestService.delete(uid),
    onSuccess: () => {
      deleteGuest(currentRow.uid);
      toast.success("Guest deleted successfully");
    },
  });

  const handleDelete = () => {
    if (value.trim() !== currentRow.nicCardNum) return;
    deleteMutation.mutate(currentRow.uid);
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
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
