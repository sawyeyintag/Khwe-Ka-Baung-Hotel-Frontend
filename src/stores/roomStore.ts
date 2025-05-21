import { create } from "zustand";
import { Room } from "@/features/rooms/data/schema";

interface RoomState {
  room: {
    roomList: Room[];
    setAllRooms: (rooms: Room[]) => void;
    createRoom: (room: Room) => void;
    updateRoom: (room: Room) => void;
    deleteRoom: (roomNumber: number) => void;
  };
}

export const useRoomStore = create<RoomState>()((set) => {
  return {
    room: {
      roomList: [],
      setAllRooms: (rooms) =>
        set((state) => ({
          ...state,
          room: { ...state.room, roomList: rooms },
        })),
      createRoom: (room) =>
        set((state) => ({
          ...state,
          room: {
            ...state.room,
            roomList: [...state.room.roomList, room],
          },
        })),
      updateRoom: (room) =>
        set((state) => ({
          ...state,
          room: {
            ...state.room,
            roomList: state.room.roomList.map((r) =>
              r.roomNumber === room.roomNumber ? room : r
            ),
          },
        })),
      deleteRoom: (roomNumber) =>
        set((state) => ({
          ...state,
          room: {
            ...state.room,
            roomList: state.room.roomList.filter(
              (r) => r.roomNumber !== roomNumber
            ),
          },
        })),
    },
  };
});
