import { Room } from "@/types/room.type";
import { RoomStatusIds } from "../data/data";

export const roomFilter = {
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
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        room.roomType.name.toLowerCase().includes(lowerSearchTerm) ||
        room.roomNumber.toLowerCase().includes(lowerSearchTerm)
      );
    };
  },

  filter(rooms: Room[], searchTerm: string, roomType: string) {
    return rooms
      .filter(this.statusFilter(roomType))
      .filter(this.searchFilter(searchTerm));
  },
};
