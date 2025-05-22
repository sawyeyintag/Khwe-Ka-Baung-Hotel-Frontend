import { useEffect } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { IconCash, IconUser, IconStairs } from "@tabler/icons-react";
import { useRoomStore } from "@/stores/roomStore";
import { Button } from "@/components/ui/button";
import { useRooms } from "../context/rooms-context";

export default function RoomsCollections() {
  const rooms = useLoaderData({ from: "/_authenticated/rooms/" });

  const { roomList, setAllRooms } = useRoomStore((state) => state.room);
  const { searchTerm, roomType, sort } = useRooms();

  useEffect(() => {
    setAllRooms(rooms);
  }, [rooms, setAllRooms]);
  const filteredRoomList = roomList
    .sort((a, b) =>
      sort === "ascending"
        ? a.roomNumber - b.roomNumber
        : b.roomNumber - a.roomNumber
    )
    .filter((room) =>
      roomType === "booked"
        ? room.status.id === 1
        : roomType === "available"
          ? room.status.id === 2
          : roomType === "notAvailable"
            ? room.status.id === 3
            : true
    )
    .filter((room) =>
      room.roomType.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  return (
    <>
      <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
        {filteredRoomList.map((room) => (
          <li
            key={room.roomNumber}
            className='rounded-lg border p-4 hover:shadow-md'
          >
            <div className='mb-8 flex items-center justify-between'>
              <div
                className={
                  "bg-muted flex size-10 items-center justify-center rounded-lg p-3"
                }
              >
                {room.roomNumber}
              </div>
              <Button variant='outline' size='sm'>
                {room.status.label ? room.status.label : "Unknown"}
              </Button>
            </div>
            <div>
              <h2 className='mb-1 font-semibold'>{room.roomType.name}</h2>
              <p className='line-clamp-2 text-gray-500'>
                <IconStairs size={16} className='mr-3 inline' />
                Floor {room.floorNumber}
              </p>
              <p className='line-clamp-2 text-gray-500'>
                <IconUser size={16} className='mr-3 inline' />
                {room.roomType.pax} Pax
              </p>
              <p className='line-clamp-2 text-gray-500'>
                <IconCash size={16} className='mr-3 inline' />
                {room.roomType.price} Ks
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
