"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { SessionCreateSchema } from "@/schemas/session.zod";
import { roomTypeService } from "@/services/room-type.service";
import { roomService } from "@/services/room.service";
import { SessionCreateFormInput } from "@/types/session.type";
import { showSubmittedData } from "@/utils/show-submitted-data";
import { Card, CardContent } from "@/components/ui/card";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { SelectDropdown } from "@/components/select-dropdown";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const floors = [{ floorNumber: 1 }, { floorNumber: 2 }];

export default function SessionsActionDialog({ open, onOpenChange }: Props) {
  const form = useForm<SessionCreateFormInput>({
    resolver: zodResolver(SessionCreateSchema),
    defaultValues: {
      roomNumber: "",
      selectedGuests: [],
      actualCheckIn: new Date(),
    },
  });

  function onSubmit(data: SessionCreateFormInput) {
    showSubmittedData(data);
  }

  const { data: roomTypes = [] } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: () => roomTypeService.getAll(),
    meta: {
      showLoadingBar: true,
    },
  });

  const { selectedRoomTypeId, selectedFloor, selectedRoomStatusId } =
    form.watch();

  const selectedRoomTypeData = useMemo(
    () => roomTypes.find((type) => type.id === Number(selectedRoomTypeId)),
    [roomTypes, selectedRoomTypeId]
  );

  const { data: rooms = [], isFetching: roomsFetching } = useQuery({
    queryKey: [
      "rooms",
      selectedRoomTypeId,
      selectedFloor,
      selectedRoomStatusId,
    ],
    queryFn: () =>
      roomService.getAll({
        roomTypeId: selectedRoomTypeId,
        floor: selectedFloor,
        roomStatusId: selectedRoomStatusId,
      }),
    meta: {
      showLoadingBar: true,
    },
  });

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
          <DialogTitle>{"Add New Session"}</DialogTitle>
          <DialogDescription>
            {
              "Create a new session by selecting a room type, floor, and room number. "
            }
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 min-w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='guest-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              {/* Room Selection */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Room Selection</h3>

                {selectedRoomTypeData && (
                  <Card className='bg-muted/50'>
                    <CardContent>
                      <div className='grid grid-cols-3 gap-4 text-sm'>
                        <div>
                          <div className='mb-3 font-medium'>Max Occupancy:</div>
                          <p>{selectedRoomTypeData.pax} guests</p>
                        </div>
                        <div>
                          <div className='mb-3 font-medium'>
                            With Breakfast:
                          </div>
                          <p>
                            {selectedRoomTypeData.priceWithBreakfast.toLocaleString()}{" "}
                            Kyat
                          </p>
                        </div>
                        <div className='w-full'>
                          <div className='mb-3 font-medium'>
                            Without Breakfast:
                          </div>
                          <p>
                            {selectedRoomTypeData.priceWithoutBreakfast.toLocaleString()}{" "}
                            Kyat
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className='flex flex-col gap-4'>
                  <FormField
                    control={form.control}
                    name='selectedRoomTypeId'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-right'>
                          Room Type
                        </FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={(val) => field.onChange(val)}
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

                  <FormField
                    control={form.control}
                    name='selectedFloor'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-right'>
                          Floor
                        </FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={(val) => field.onChange(val)}
                          placeholder='Select a room type'
                          className='col-span-4 w-full'
                          items={floors.map(({ floorNumber }) => ({
                            label: String(floorNumber),
                            value: String(floorNumber),
                          }))}
                        />
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='roomNumber'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-right'>
                          Room Number
                        </FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={(val) => field.onChange(val)}
                          placeholder='Select a room'
                          className='col-span-4 w-full'
                          isPending={roomsFetching}
                          items={rooms.map(({ roomNumber }) => ({
                            label: roomNumber,
                            value: roomNumber,
                          }))}
                        />
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Guest Management */}
              {/* <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>Guest Management</h3>
                  <Button onClick={addGuestSearch} variant='outline' size='sm'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Guest
                  </Button>
                </div>

                {guestSearches.map((search, index) => (
                  <Card key={index} className='relative'>
                    <CardContent className='pt-4'>
                      {guestSearches.length > 1 && (
                        <Button
                          onClick={() => removeGuestSearch(index)}
                          variant='ghost'
                          size='sm'
                          className='absolute top-2 right-2'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      )}

                      <div className='space-y-4'>
                        <div className='flex gap-2'>
                          <div className='flex-1'>
                            <Label htmlFor={`nicSearch-${index}`}>
                              NIC Card Number
                            </Label>
                            <div className='flex gap-2'>
                              <Input
                                id={`nicSearch-${index}`}
                                value={search}
                                onChange={(e) =>
                                  handleGuestSearch(index, e.target.value)
                                }
                                placeholder='Enter NIC card number'
                              />
                              <Button
                                onClick={() => handleGuestSearch(index, search)}
                                variant='outline'
                                size='icon'
                              >
                                <Search className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {selectedGuests[index] ? (
                          <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                            <div className='mb-2 flex items-center gap-2'>
                              <Badge variant='secondary'>Guest Found</Badge>
                            </div>
                            <div className='grid grid-cols-1 gap-2 text-sm md:grid-cols-2'>
                              <p>
                                <strong>Name:</strong>{" "}
                                {selectedGuests[index].name}
                              </p>
                              <p>
                                <strong>Phone:</strong>{" "}
                                {selectedGuests[index].phone}
                              </p>
                              <p>
                                <strong>Email:</strong>{" "}
                                {selectedGuests[index].email}
                              </p>
                              <p>
                                <strong>Address:</strong>{" "}
                                {selectedGuests[index].address}
                              </p>
                            </div>
                          </div>
                        ) : search && !findGuestByNIC(search) ? (
                          <div className='space-y-4 rounded-lg border border-orange-200 bg-orange-50 p-4'>
                            <div className='flex items-center gap-2'>
                              <Badge variant='outline'>
                                Guest Not Found - Create New
                              </Badge>
                            </div>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                              <div>
                                <Label htmlFor={`name-${index}`}>Name</Label>
                                <Input
                                  id={`name-${index}`}
                                  value={newGuestForms[index]?.name || ""}
                                  onChange={(e) =>
                                    handleNewGuestChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder='Enter guest name'
                                />
                              </div>
                              <div>
                                <Label htmlFor={`phone-${index}`}>Phone</Label>
                                <Input
                                  id={`phone-${index}`}
                                  value={newGuestForms[index]?.phone || ""}
                                  onChange={(e) =>
                                    handleNewGuestChange(
                                      index,
                                      "phone",
                                      e.target.value
                                    )
                                  }
                                  placeholder='Enter phone number'
                                />
                              </div>
                              <div>
                                <Label htmlFor={`email-${index}`}>Email</Label>
                                <Input
                                  id={`email-${index}`}
                                  type='email'
                                  value={newGuestForms[index]?.email || ""}
                                  onChange={(e) =>
                                    handleNewGuestChange(
                                      index,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  placeholder='Enter email address'
                                />
                              </div>
                              <div>
                                <Label htmlFor={`address-${index}`}>
                                  Address
                                </Label>
                                <Input
                                  id={`address-${index}`}
                                  value={newGuestForms[index]?.address || ""}
                                  onChange={(e) =>
                                    handleNewGuestChange(
                                      index,
                                      "address",
                                      e.target.value
                                    )
                                  }
                                  placeholder='Enter address'
                                />
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div> */}

              <Separator />

              {/* Additional Details */}
              {/* <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Additional Details</h3>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className='space-y-2'>
                    <Label htmlFor='extraBeds'>Number of Extra Beds</Label>
                    <Input
                      id='extraBeds'
                      type='number'
                      min='0'
                      value={extraBeds}
                      onChange={(e) =>
                        setExtraBeds(Number.parseInt(e.target.value) || 0)
                      }
                      placeholder='0'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Check-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className='w-full justify-start text-left font-normal'
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {checkInDate
                            ? format(checkInDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={checkInDate}
                          onSelect={setCheckInDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='checkInTime'>Check-in Time</Label>
                    <Input
                      id='checkInTime'
                      type='time'
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                    />
                  </div>
                </div>
              </div> */}

              <Separator />

              {/* Action Buttons */}
              {/* <div className='flex gap-4 pt-4'>
                <Button
                  onClick={createSession}
                  disabled={!roomNumber || selectedGuests.length === 0}
                  className='flex-1'
                >
                  Create Session
                </Button>
                <Button variant='outline' className='flex-1'>
                  Cancel
                </Button>
              </div> */}
            </form>
          </Form>
        </div>
        <DialogFooter>
          {/* <Button type='submit' form='guest-form' disabled={isPending}>
            {isPending && <Loader2 className='animate-spin' />}
            Save changes
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
