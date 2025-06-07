import { Room } from "@/types/room.type";
import { RoomStatusIds } from "../data/data";

export const roomFilterSorter = {
  roomSorter(sort: string) {
    return (a: Room, b: Room) => {
      return sort === "ascending"
        ? Number(a.roomNumber) - Number(b.roomNumber)
        : Number(b.roomNumber) - Number(a.roomNumber);
    };
  },

  statusFilter(roomType: string) {
    return (room: Room) => {
      switch (roomType) {
        case "booked":
          return room.status.id === RoomStatusIds.BOOKED;
        case "available":
          return room.status.id === RoomStatusIds.AVAILABLE;
        case "notAvailable":
          return room.status.id === RoomStatusIds.NOT_AVAILABLE;
        default:
          return true;
      }
    };
  },

  searchFilter(searchTerm: string) {
    return (room: Room) => {
      return room.roomType.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    };
  },

  filterAndSort(
    rooms: Room[],
    searchTerm: string,
    roomType: string,
    sort: string
  ) {
    return rooms
      .sort(this.roomSorter(sort))
      .filter(this.statusFilter(roomType))
      .filter(this.searchFilter(searchTerm));
  },
};
