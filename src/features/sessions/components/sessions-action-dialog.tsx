"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { RoomStatusIds } from "@/enums/RoomStatusIds";
import { guestService } from "@/services/guest.service";
import { roomTypeService } from "@/services/room-type.service";
import { roomService } from "@/services/room.service";
import { Search, X, Loader2, User, Users, Bed, Calendar } from "lucide-react";
import { showSubmittedData } from "@/utils/show-submitted-data";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SelectDropdown } from "@/components/select-dropdown";

// Simplified schema
const SessionFormSchema = z
  .object({
    selectedRoomTypeId: z.string().min(1, "Please select a room type"),
    selectedFloor: z.string().min(1, "Please select a floor"),
    roomNumber: z.string().min(1, "Room number is required"),
    guestIds: z.array(z.string()),
    extraBeds: z.number().min(0).max(10),
    actualCheckIn: z.date(),
  })
  .refine((data) => data.guestIds.length > 0, {
    message: "At least one guest is required",
    path: ["guestIds"],
  });

type SessionFormData = z.infer<typeof SessionFormSchema>;

interface Guest {
  uid: string;
  name: string;
  nicCardNum: string;
  phone: string;
  email?: string;
  address?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const floors = [{ floorNumber: 1 }, { floorNumber: 2 }];

export default function SessionsActionDialog({ open, onOpenChange }: Props) {
  const [guestSearch, setGuestSearch] = useState("");
  const [searchedGuest, setSearchedGuest] = useState<Guest | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedGuestsData, setSelectedGuestsData] = useState<Guest[]>([]);

  const form = useForm<SessionFormData>({
    resolver: zodResolver(SessionFormSchema),
    defaultValues: {
      roomNumber: "",
      guestIds: [],
      actualCheckIn: new Date(),
      extraBeds: 0,
      selectedRoomTypeId: "",
      selectedFloor: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: SessionFormData) {
    const sessionPayload = {
      roomNumber: data.roomNumber,
      guestIds: data.guestIds,
      numberOfExtraBeds: data.extraBeds,
      actualCheckIn: data.actualCheckIn,
    };

    showSubmittedData(sessionPayload, "Session Data Submitted");

    // await sessionService.create(sessionPayload);

    // Reset and close
    form.reset();
    setSearchedGuest(null);
    setGuestSearch("");
    setSelectedGuestsData([]);
    onOpenChange(false);
  }

  // Search guest by NIC card number
  const searchGuestByNic = async () => {
    if (!guestSearch.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setSearchedGuest(null);

    try {
      const guest = await guestService.getGuestByNicCardNum(guestSearch);
      if (guest) {
        setSearchedGuest(guest);
      } else {
        setSearchError("No guest found with this NIC card number");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error searching guest:", error);
      setSearchError("Error searching for guest. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Add guest to selection
  const addGuest = (guest: Guest) => {
    const currentIds = form.getValues("guestIds");
    if (!currentIds.includes(guest.uid)) {
      form.setValue("guestIds", [...currentIds, guest.uid]);
      setSelectedGuestsData([...selectedGuestsData, guest]);
    }
    setSearchedGuest(null);
    setGuestSearch("");
  };

  // Remove guest from selection
  const removeGuest = (guestId: string) => {
    const currentIds = form.getValues("guestIds");
    form.setValue(
      "guestIds",
      currentIds.filter((id) => id !== guestId)
    );
    setSelectedGuestsData(selectedGuestsData.filter((g) => g.uid !== guestId));
  };

  // Queries
  const { data: roomTypes = [] } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: () => roomTypeService.getAll(),
  });

  const { selectedRoomTypeId, selectedFloor } = form.watch();

  const selectedRoomTypeData = useMemo(
    () => roomTypes.find((type) => type.id === Number(selectedRoomTypeId)),
    [roomTypes, selectedRoomTypeId]
  );

  const { data: rooms = [], isFetching: roomsFetching } = useQuery({
    queryKey: [
      "rooms",
      selectedRoomTypeId,
      selectedFloor,
      RoomStatusIds.AVAILABLE,
    ],
    queryFn: () =>
      roomService.getAll({
        roomTypeId: selectedRoomTypeId,
        floor: selectedFloor,
        roomStatusId: String(RoomStatusIds.AVAILABLE),
      }),
    enabled: !!selectedRoomTypeId && !!selectedFloor,
  });

  // Calculate occupancy
  const totalGuests = form.watch("guestIds").length;
  const maxOccupancy = selectedRoomTypeData?.pax || 0;
  const canAddMoreGuests = totalGuests < maxOccupancy;

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        setSearchedGuest(null);
        setGuestSearch("");
        setSearchError("");
        setSelectedGuestsData([]);
        onOpenChange(state);
      }}
    >
      <DialogContent className='max-h-[90vh] sm:max-w-3xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription>
            Select a room and add guests to create a new session.
          </DialogDescription>
        </DialogHeader>

        <div className='-mr-4 max-h-[60vh] overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='session-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6 p-0.5'
            >
              {/* Room Selection */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Room Selection</h3>

                <div className='grid gap-4'>
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
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("roomNumber", "");
                          }}
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
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("roomNumber", "");
                          }}
                          placeholder='Select a floor'
                          className='col-span-4 w-full'
                          items={floors.map(({ floorNumber }) => ({
                            label: `Floor ${floorNumber}`,
                            value: String(floorNumber),
                          }))}
                        />
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />

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
                          disabled={!selectedRoomTypeId || !selectedFloor}
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

                {selectedRoomTypeData && (
                  <Card className='bg-muted/50'>
                    <CardContent className='pt-6'>
                      <div className='grid grid-cols-3 gap-4 text-sm'>
                        <div className='flex items-center gap-2'>
                          <Users className='text-muted-foreground h-4 w-4' />
                          <div>
                            <div className='text-muted-foreground text-xs'>
                              Max Occupancy
                            </div>
                            <p className='font-semibold'>
                              {selectedRoomTypeData.pax} guests
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Bed className='text-muted-foreground h-4 w-4' />
                          <div>
                            <div className='text-muted-foreground text-xs'>
                              With Breakfast
                            </div>
                            <p className='font-semibold'>
                              {selectedRoomTypeData.priceWithBreakfast.toLocaleString()}{" "}
                              Ks
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Calendar className='text-muted-foreground h-4 w-4' />
                          <div>
                            <div className='text-muted-foreground text-xs'>
                              Without Breakfast
                            </div>
                            <p className='font-semibold'>
                              {selectedRoomTypeData.priceWithoutBreakfast.toLocaleString()}{" "}
                              Ks
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator />

              {/* Guest Selection */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>Guests</h3>
                  <Badge
                    variant={totalGuests > 0 ? "default" : "secondary"}
                    className='gap-1'
                  >
                    <Users className='h-3 w-3' />
                    {totalGuests} / {maxOccupancy || "?"} guests
                  </Badge>
                </div>

                {/* Search Section */}
                <Card>
                  <CardContent className='pt-6'>
                    <div className='space-y-4'>
                      <div className='flex gap-2'>
                        <div className='relative flex-1'>
                          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                          <Input
                            placeholder='Enter NIC card number...'
                            value={guestSearch}
                            onChange={(e) => {
                              setGuestSearch(e.target.value);
                              setSearchError("");
                              setSearchedGuest(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                searchGuestByNic();
                              }
                            }}
                            className='pl-9'
                          />
                        </div>
                        <Button
                          type='button'
                          onClick={searchGuestByNic}
                          disabled={isSearching || !guestSearch.trim()}
                        >
                          {isSearching ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            "Search"
                          )}
                        </Button>
                      </div>

                      {/* Search Result */}
                      {searchedGuest && (
                        <div className='bg-muted/30 rounded-lg border p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                                <User className='text-primary h-5 w-5' />
                              </div>
                              <div>
                                <p className='font-medium'>
                                  {searchedGuest.name}
                                </p>
                                <p className='text-muted-foreground text-sm'>
                                  {searchedGuest.nicCardNum} •{" "}
                                  {searchedGuest.phone}
                                </p>
                              </div>
                            </div>
                            <Button
                              type='button'
                              size='sm'
                              onClick={() => addGuest(searchedGuest)}
                              disabled={
                                !canAddMoreGuests ||
                                form
                                  .getValues("guestIds")
                                  .includes(searchedGuest.uid)
                              }
                            >
                              {form
                                .getValues("guestIds")
                                .includes(searchedGuest.uid)
                                ? "Already Added"
                                : "Add Guest"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Error Message */}
                      {searchError && (
                        <Alert variant='destructive'>
                          <AlertDescription>{searchError}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Guests */}
                {selectedGuestsData.length > 0 && (
                  <div className='space-y-3'>
                    <p className='text-muted-foreground text-sm font-medium'>
                      Selected Guests
                    </p>
                    <div className='grid gap-2'>
                      {selectedGuestsData.map((guest) => (
                        <Card key={guest.uid} className='overflow-hidden'>
                          <CardContent className='p-0'>
                            <div className='flex items-center justify-between p-3'>
                              <div className='flex items-center gap-3'>
                                <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full'>
                                  <User className='text-primary h-4 w-4' />
                                </div>
                                <div>
                                  <p className='text-sm font-medium'>
                                    {guest.name}
                                  </p>
                                  <p className='text-muted-foreground text-xs'>
                                    {guest.address}
                                  </p>
                                  <p className='text-muted-foreground text-xs'>
                                    {guest.nicCardNum} • {guest.phone}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type='button'
                                size='sm'
                                variant='ghost'
                                className='h-8 w-8 p-0'
                                onClick={() => removeGuest(guest.uid)}
                              >
                                <X className='h-4 w-4' />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Validation Message */}
                <FormField
                  control={form.control}
                  name='guestIds'
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Additional Options */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Additional Options</h3>

                <FormField
                  control={form.control}
                  name='extraBeds'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-right'>
                        Extra Beds
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='0'
                          max='10'
                          className='col-span-4'
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            form='session-form'
            disabled={isSubmitting || totalGuests === 0}
          >
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Create Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
