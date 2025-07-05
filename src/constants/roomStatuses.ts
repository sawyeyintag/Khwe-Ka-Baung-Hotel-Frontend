import { RoomStatusIds } from "../enums/RoomStatusIds";

export const roomStatuses = [
  { id: RoomStatusIds.AVAILABLE, label: "Available" },
  { id: RoomStatusIds.IN_SESSION, label: "In Session" },
  { id: RoomStatusIds.NOT_AVAILABLE, label: "Not Available" },
  { id: RoomStatusIds.BOOKED, label: "Booked" },
];
