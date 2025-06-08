"use client";

import { useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { showSubmittedData } from "@/utils/show-submitted-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Room } from "../../schema/room.zod";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRoom: Room;
}

export function RoomsDeleteDialog({ open, onOpenChange, currentRoom }: Props) {
  const [value, setValue] = useState<string>();

  const handleDelete = () => {
    if (value !== currentRoom.roomNumber) return;

    onOpenChange(false);
    showSubmittedData(currentRoom, "The following room has been deleted:");
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value !== currentRoom.roomNumber}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{" "}
          Delete Room
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{" "}
            <span className='font-bold'>{currentRoom.roomNumber}</span>?
            <br />
            This action will permanently remove the room with the type of{" "}
            <span className='font-bold'>{currentRoom.roomNumber}</span> from the
            system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Room Number:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter room number to confirm deletion.'
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
