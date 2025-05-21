export enum RoomStatusIds {
  Available = 1,
  NotAvailable,
  Booked,
}

export enum RoomTypeIds {
  SingleBedRoom = 1,
  DoubleBedRoom,
}

export const roomStatuses = [
  {
    id: 1,
    label: "Available",
  },
  {
    id: 2,
    label: "Not Available",
  },
  {
    id: 3,
    label: "Booked",
  },
] as const;

export const roomTypes = [
  {
    id: 1,
    name: "Single Beds Room",
    price: 32000,
    pax: 2,
    rooms: [],
  },
  {
    id: 2,
    name: "Double Bed Room",
    price: 32000,
    pax: 2,
    rooms: [],
  },
] as const;
