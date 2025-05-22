import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showSubmittedData } from "@/utils/show-submitted-data";
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
import { roomTypes } from "../data/data";
import { Room } from "../data/schema";

const formSchema = z.object({
  roomNumber: z.coerce
    .number()
    .int()
    .min(100, { message: "Room number must be a 3-digit number" })
    .max(999, { message: "Room number must be a 3-digit number" }),
  floorNumber: z.coerce
    .number()
    .int()
    .min(1, { message: "Floor number must be a one-digit number" })
    .max(9, { message: "Floor number must be a one-digit number" }),
  roomTypeId: z
    .number()
    .min(1, { message: "Room type is required" })
    .transform((val) => Number(val)),
  isEdit: z.boolean(),
});

type RoomForm = z.infer<typeof formSchema>;

interface Props {
  currentRow?: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomsActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow;
  const form = useForm<RoomForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          roomNumber: undefined,
          floorNumber: 1,
          roomTypeId: undefined,
          isEdit,
        },
  });

  const onSubmit = (values: RoomForm) => {
    form.reset();
    showSubmittedData(values);
    onOpenChange(false);
  };

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
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Room Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='101'
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
          <Button type='submit' form='room-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
