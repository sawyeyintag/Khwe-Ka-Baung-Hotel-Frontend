"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IconBed } from "@tabler/icons-react";
import { RoomStatusIds } from "@/enums/RoomStatusIds";
import { SessionCreateSchema } from "@/schemas/session.zod";
import { roomTypeService } from "@/services/room-type.service";
import { roomService } from "@/services/room.service";
import { sessionService } from "@/services/session.service";
import { Guest } from "@/types/guest.type";
import {
  SessionCreateFormData,
  SessionCreateFormInput,
} from "@/types/session.type";
import {
  X,
  Loader2,
  User,
  Users,
  Bed,
  Calendar,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SelectDropdown } from "@/components/select-dropdown";
import { GuestSearchCombobox } from "@/features/guests/components/guest-search-combobox";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const floors = [{ floorNumber: 1 }, { floorNumber: 2 }];

const steps = [
  {
    id: 1,
    title: "Room Selection",
    description: "Choose room type and number",
  },
  { id: 2, title: "Choose Guest", description: "Add guests to the session" },
  { id: 3, title: "Confirm", description: "Review and create session" },
];

export default function SessionsActionDialog({ open, onOpenChange }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGuestsData, setSelectedGuestsData] = useState<Guest[]>([]);

  const form = useForm<SessionCreateFormInput>({
    resolver: zodResolver(SessionCreateSchema),
    defaultValues: {
      roomNumber: "",
      guestIds: [],
      actualCheckIn: new Date(),
      numberOfExtraBeds: 0,
      isBreakfastIncluded: false,
      selectedRoomTypeId: "",
      note: "",
      selectedFloor: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const data = form.getValues();
    const sessionPayload: SessionCreateFormData = {
      roomNumber: data.roomNumber,
      guestIds: data.guestIds,
      numberOfExtraBeds: data.numberOfExtraBeds,
      actualCheckIn: data.actualCheckIn,
      isBreakfastIncluded: data.isBreakfastIncluded,
      note: data.note,
    };

    mutate(sessionPayload, {
      onSuccess: () => {
        // Reset form and close dialog
        form.reset();
        setSelectedGuestsData([]);
        setCurrentStep(1);
        onOpenChange(false);
      },
    });
  };

  // Add guest to selection
  function addGuest(guest: Guest) {
    const currentIds = form.getValues("guestIds");
    if (!currentIds.includes(guest.uid)) {
      form.setValue("guestIds", [...currentIds, guest.uid]);
      setSelectedGuestsData([...selectedGuestsData, guest]);
    }
  }

  // Remove guest from selection
  function removeGuest(guestId: string) {
    const currentIds = form.getValues("guestIds");
    form.setValue(
      "guestIds",
      currentIds.filter((id: string) => id !== guestId)
    );
    setSelectedGuestsData(selectedGuestsData.filter((g) => g.uid !== guestId));
  }

  // Queries
  const { data: roomTypes = [] } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: () => roomTypeService.getAll(),
  });

  const { selectedRoomTypeId, selectedFloor, numberOfExtraBeds } = form.watch();

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

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (data: SessionCreateFormData) => sessionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  // Calculate occupancy including extra beds
  const totalGuests = form.watch("guestIds").length;
  const maxOccupancy = (selectedRoomTypeData?.pax || 0) + numberOfExtraBeds;
  const canAddMoreGuests = totalGuests < maxOccupancy;

  // Validation for each step
  const validateStep = async (step: number) => {
    switch (step) {
      case 1: {
        const result = await form.trigger([
          "selectedRoomTypeId",
          "selectedFloor",
          "roomNumber",
          "numberOfExtraBeds",
        ]);
        return result;
      }
      case 2: {
        const guestResult = await form.trigger(["guestIds"]);
        return guestResult && form.getValues("guestIds").length > 0;
      }
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetDialog = () => {
    form.reset();
    setSelectedGuestsData([]);
    setCurrentStep(1);
  };

  // Stepper Component
  const Stepper = () => (
    <div className='mb-4 flex w-full items-center justify-between rounded-lg px-4 py-2'>
      {steps.map((step, index) => (
        <div key={step.id} className='bg flex items-center'>
          <div className='flex flex-col items-center'>
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                currentStep >= step.id
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground/25 text-muted-foreground"
              )}
            >
              {currentStep > step.id ? (
                <Check className='h-5 w-5' />
              ) : (
                <span className='text-sm font-semibold'>{step.id}</span>
              )}
            </div>
            <div className='mt-2 text-center'>
              <p
                className={cn(
                  "text-sm font-medium",
                  currentStep >= step.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </p>
              <p className='text-muted-foreground hidden text-xs sm:block'>
                {step.description}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "mx-4 mt-5 h-0.5 flex-1 transition-all",
                currentStep > step.id ? "bg-primary" : "bg-muted-foreground/25"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        resetDialog();
        onOpenChange(state);
      }}
    >
      <DialogContent className='max-h-[90vh] sm:max-w-3xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription>
            Follow the steps to create a new hotel session.
          </DialogDescription>
        </DialogHeader>

        <Stepper />

        <div className='-mr-4 max-h-[50vh] overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <div className='space-y-6 p-0.5'>
              {/* Step 1: Room Selection */}

              {currentStep === 1 && (
                <div className='space-y-4'>
                  {selectedRoomTypeData && (
                    <Card className='bg-muted/50'>
                      <CardContent>
                        <div className='flex justify-between'>
                          <div className='flex flex-col gap-2'>
                            <div className='flex w-full items-center gap-1'>
                              <Users className='text-muted-foreground h-4 w-4' />
                              <span className='text-muted-foreground text-xs'>
                                Total Capacity
                              </span>
                            </div>

                            <p className='font-semibold'>
                              {maxOccupancy} guests
                            </p>
                          </div>

                          <div className='flex flex-col gap-2'>
                            <div className='flex w-full items-center gap-1'>
                              <Bed className='text-muted-foreground h-4 w-4' />
                              <span className='text-muted-foreground text-xs'>
                                With Breakfast
                              </span>
                            </div>

                            <p className='font-semibold'>
                              {selectedRoomTypeData.priceWithBreakfast.toLocaleString()}{" "}
                              Ks
                            </p>
                          </div>

                          <div className='flex flex-col gap-2'>
                            <div className='flex w-full items-center gap-1'>
                              <Calendar className='text-muted-foreground h-4 w-4' />
                              <span className='text-muted-foreground text-xs'>
                                Without Breakfast
                              </span>
                            </div>

                            <p className='font-semibold'>
                              {selectedRoomTypeData.priceWithoutBreakfast.toLocaleString()}{" "}
                              Ks
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

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

                    <FormField
                      control={form.control}
                      name='numberOfExtraBeds'
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

                    <FormField
                      control={form.control}
                      name='isBreakfastIncluded'
                      render={({ field }) => (
                        <FormItem className='mt-3 grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                          <FormLabel className='col-span-2 text-right'>
                            Breakfast
                          </FormLabel>
                          <RadioGroup
                            className='col-span-4 flex'
                            onValueChange={(val) => field.onChange(val)}
                            defaultValue='comfortable'
                          >
                            <div className='flex items-center gap-3'>
                              <RadioGroupItem value='default' id='r1' />
                              <Label htmlFor='r1'>With Breakfast</Label>
                            </div>
                            <div className='flex items-center gap-3'>
                              <RadioGroupItem value='comfortable' id='r2' />
                              <Label htmlFor='r2'>Without Breakfast</Label>
                            </div>
                          </RadioGroup>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Guest Selection */}
              {currentStep === 2 && (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold'>Select Guests</h3>
                    <Badge
                      variant={totalGuests > 0 ? "default" : "secondary"}
                      className='gap-1'
                    >
                      <Users className='h-3 w-3' />
                      {totalGuests} / {maxOccupancy || "?"} guests
                    </Badge>
                  </div>

                  {/* Search Section */}
                  <FormField
                    control={form.control}
                    name='guestIds'
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <GuestSearchCombobox
                            onGuestSelect={(guest) => {
                              addGuest(guest);
                            }}
                            excludeGuestIds={selectedGuestsData.map(
                              (g) => g.uid
                            )}
                            disabled={!canAddMoreGuests}
                            searchDelay={500} // Wait longer before searching
                            minSearchLength={3} // Require at least 3 characters
                            maxResults={5} // Show only top 5 results
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                </div>
              )}

              {/* Step 3: Confirm */}
              {currentStep === 3 && (
                <div className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Session Summary</CardTitle>
                      <CardDescription>
                        Please review the details before creating the session
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {/* Room Details */}
                      <div>
                        <div className='my-2 flex items-center gap-2'>
                          <IconBed className='text-primary h-4 w-4' />
                          <h4 className='font-semibold'>Room Detail</h4>
                        </div>
                        <div className='grid gap-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Room Type:
                            </span>
                            <span className='font-medium'>
                              {selectedRoomTypeData?.name || "N/A"}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Room Number:
                            </span>
                            <span className='font-medium'>
                              {form.watch("roomNumber") || "N/A"}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Check-In Date:
                            </span>
                            <span className='font-medium'>
                              {form.watch("actualCheckIn").toLocaleDateString()}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Extra Beds:
                            </span>
                            <span className='font-medium'>
                              {numberOfExtraBeds}
                            </span>
                          </div>
                        </div>

                        <div className='mt-5 mb-2 flex items-center gap-2'>
                          <User className='text-primary h-4 w-4' />
                          <h4 className='font-semibold'>Guest & Pricing</h4>
                        </div>
                        <div className='grid gap-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Total Guests:
                            </span>
                            <span className='font-medium'>{totalGuests}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Breakfast Included:
                            </span>
                            <span className='font-medium'>
                              {form.watch("isBreakfastIncluded") ? "Yes" : "No"}
                            </span>
                          </div>

                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Total Price:
                            </span>
                            <span className='font-medium'>
                              {selectedRoomTypeData
                                ? (form.watch("isBreakfastIncluded")
                                    ? selectedRoomTypeData.priceWithBreakfast
                                    : selectedRoomTypeData.priceWithoutBreakfast) *
                                  (1 + numberOfExtraBeds)
                                : "N/A"}{" "}
                              Ks
                            </span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Guest Details */}
                      <div>
                        <h4 className='mb-2 font-semibold'>Guest List</h4>
                        <div className='space-y-2'>
                          {selectedGuestsData.map((guest) => (
                            <div
                              key={guest.uid}
                              className='bg-muted/100 rounded-lg p-5 text-sm'
                            >
                              <p className='font-medium'>{guest.name}</p>
                              <p className='text-muted-foreground text-xs'>
                                {guest.nicCardNum} • {guest.phone}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Note */}
                      <FormField
                        control={form.control}
                        name='note'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Note (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Add any additional notes for this session...'
                                className='resize-none'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </Form>
        </div>

        <DialogFooter className='flex-col gap-2 sm:flex-row'>
          <div className='flex flex-1 gap-2'>
            {currentStep > 1 && (
              <Button
                variant='outline'
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                <ChevronLeft className='mr-2 h-4 w-4' />
                Previous
              </Button>
            )}
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            {currentStep < 3 ? (
              <Button onClick={handleNext} disabled={isSubmitting}>
                Next
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || totalGuests === 0}
              >
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Create Session
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
