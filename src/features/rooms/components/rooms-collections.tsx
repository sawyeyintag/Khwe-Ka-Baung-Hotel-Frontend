import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconCash, IconUser, IconStairs } from "@tabler/icons-react";
import { roomService } from "@/services/room.service";
import { Button } from "@/components/ui/button";
import { useRooms } from "../context/rooms-context";
import { roomFilterSorter } from "../utils/room-filters";

export default function RoomsCollections() {
  const { searchTerm, roomType, sort } = useRooms();

  const { data: rooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => roomService.getAll(),
    meta: {
      showLoadingBar: true,
    },
  });

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    return roomFilterSorter.filterAndSort(rooms, searchTerm, roomType, sort);
  }, [rooms, searchTerm, roomType, sort]);

  return (
    <>
      {filteredRooms.length === 0 ? (
        <div className='mx-auto my-16 py-8 text-center'>
          <img
            className='mx-auto w-40'
            src='/images/database_not_found.png'
            alt='not found'
          />
          <p className='text-center text-xl font-semibold'>
            No rooms available
          </p>
        </div>
      ) : (
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {filteredRooms.map((room) => (
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
      )}
    </>
  );
}
