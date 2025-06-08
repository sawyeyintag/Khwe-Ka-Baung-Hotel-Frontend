export enum RoomTypeIds {
  SingleBedRoom = 1,
  DoubleBedRoom,
}

export enum RoomStatusIds {
  AVAILABLE = 1,
  NOT_AVAILABLE,
  BOOKED,
  IN_SESSION,
}

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
