import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { guestFormSchema } from "@/schemas/guest.zod";
import { guestService } from "@/services/guest.service";
import { Guest, GuestFormInput } from "@/types/guest.type";
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

interface Props {
  currentRow?: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuestsActionDialog({ currentRow, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!currentRow;
  const form = useForm<GuestFormInput>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          name: "",
          email: "",
          phone: "",
          address: "",
          nicCardNum: "",
          isEdit,
        },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: GuestFormInput) => {
      const guest = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        nicCardNum: values.nicCardNum,
      };
      if (values.isEdit && currentRow) {
        return guestService.update(currentRow.uid, guest);
      } else {
        return guestService.create(guest);
      }
    },
    onSuccess: () => {
      if (form.getValues().isEdit) {
        toast.success("Guest updated successfully");
      } else {
        toast.success("Guest created successfully");
      }
      queryClient.invalidateQueries({
        queryKey: ["guests"],
      });
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = async (values: GuestFormInput) => {
    mutate(values);
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
          <DialogTitle>{isEdit ? "Edit Guest" : "Add New Guest"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the guest here. " : "Create new guest here. "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[16rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='guest-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nicCardNum'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      NIC Card Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='MG123456'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='123 Main St'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+123456789'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='guest-form' disabled={isPending}>
            {isPending && <Loader2 className='animate-spin' />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
