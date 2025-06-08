import { RoomStatusIds } from "../data/data";

export function getRoomStatusColor(status: RoomStatusIds) {
  const roomStatusColors: Record<number, string> = {
    [RoomStatusIds.AVAILABLE]: "bg-green-100 text-green-800 hover:bg-green-200",
    [RoomStatusIds.NOT_AVAILABLE]: "bg-red-100 text-red-800 hover:bg-red-200",
    [RoomStatusIds.BOOKED]: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  };

  return (
    roomStatusColors[status] ?? "bg-gray-100 text-gray-800 hover:bg-gray-100"
  );
}
