import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconCash, IconUser, IconStairs, IconBed } from "@tabler/icons-react";
import { roomService } from "@/services/room.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRooms } from "../context/rooms-context";
import { roomFilterSorter } from "../utils/room-filters";
import { getRoomStatusColor } from "../utils/room-status-color";
import { RoomCardActions } from "./room-card-actions";

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
        <div className='py-12 text-center'>
          <IconBed className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <h3 className='mb-2 text-lg font-semibold'>No rooms found</h3>
          <p className='text-muted-foreground mb-4'>
            {searchTerm || roomType !== "All"
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first room"}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {filteredRooms.map((room) => (
            <Card
              key={room.roomNumber}
              className='group hover:border-primary/20 gap-3 border-2 transition-all duration-200 hover:shadow-lg'
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='text-2xl font-bold'>{room.roomNumber}</h3>
                      <Badge className={getRoomStatusColor(room.status.id)}>
                        {room.status.label || "Unknown"}
                      </Badge>
                    </div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      {room.roomType.name}
                    </p>
                  </div>
                  <RoomCardActions {...room} />
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div className='text-muted-foreground flex items-center gap-2'>
                    <IconStairs className='h-4 w-4' />
                    Floor {room.floorNumber}
                  </div>
                  <div className='text-muted-foreground flex items-center gap-2'>
                    <IconUser className='h-4 w-4' />
                    {room.roomType.pax} Pax
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <IconCash className='text-muted-foreground h-4 w-4' />
                  <span className='text-lg font-semibold'>
                    {room.roomType.price.toLocaleString()} Ks
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
