import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { roomTypeService } from "@/services/room-type.service";
import { roomService } from "@/services/room.service";
import { Room } from "@/types/room.type";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectDropdown } from "@/components/select-dropdown";
import { roomUpsertSchema } from "../../../schemas/room.zod";

type RoomForm = z.infer<typeof roomUpsertSchema>;

interface Props {
  currentRoom?: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomsActionDialog({ currentRoom, open, onOpenChange }: Props) {
  const isEdit = !!currentRoom;
  const form = useForm<RoomForm>({
    resolver: zodResolver(roomUpsertSchema),
    defaultValues: isEdit
      ? {
          ...currentRoom,
          isEdit,
        }
      : {
          roomNumber: "",
          floorNumber: 0,
          roomTypeId: 0,
          isEdit,
        },
  });

  const queryClient = useQueryClient();

  const { data: roomTypes = [] } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: () => roomTypeService.getAll(),
    meta: {
      showLoadingBar: true,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: RoomForm) => {
      const { roomNumber, floorNumber, roomTypeId } = values;
      if (values.isEdit && currentRoom) {
        const updatedRoom = {
          floorNumber,
          roomTypeId,
        };
        return roomService.update(currentRoom.roomNumber, updatedRoom);
      } else {
        const newRoom = {
          roomNumber,
          floorNumber,
          roomTypeId,
        };
        return roomService.create(newRoom);
      }
    },
    onSuccess: () => {
      if (form.getValues().isEdit) {
        toast.success("Room updated successfully");
      } else {
        toast.success("Room created successfully");
      }
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
      form.reset();
      onOpenChange(false);
    },
  });

  function onSubmit(values: RoomForm) {
    mutate(values);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? "Edit Room" : "Add New Room"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the room here. " : "Create new room here. "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[10-rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='room-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='roomNumber'
                disabled={isEdit}
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Room Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='101'
                        className='col-span-4'
                        type='string'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='floorNumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Floor Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='1'
                        className='col-span-4'
                        type='number'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='roomTypeId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Room Type
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value)}
                      onValueChange={(val) => field.onChange(Number(val))}
                      placeholder='Select a room type'
                      className='col-span-4 w-full'
                      items={roomTypes.map(({ name, id }) => ({
                        label: name,
                        value: String(id),
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='room-form' disabled={isPending}>
            {isPending && <Loader2 className='animate-spin' />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
