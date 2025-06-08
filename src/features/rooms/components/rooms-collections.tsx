import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  IconUser,
  IconStairs,
  IconBed,
  IconCoffee,
  IconX,
} from "@tabler/icons-react";
import { roomService } from "@/services/room.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRooms } from "../context/rooms-context";
import { roomFilter } from "../utils/room-filters";
import { getRoomStatusColor } from "../utils/room-status-color";
import { RoomCardActions } from "./room-card-actions";

export default function RoomsCollections() {
  const { searchTerm, roomType } = useRooms();

  const { data: rooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => roomService.getAll(),
    meta: {
      showLoadingBar: true,
    },
  });

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    return roomFilter.filter(rooms, searchTerm, roomType);
  }, [rooms, searchTerm, roomType]);

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
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'>
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

                {/* Improved Pricing Section */}
                <div className='space-y-3'>
                  <h4 className='text-muted-foreground text-sm font-medium'>
                    Pricing Options
                  </h4>

                  {/* With Breakfast */}
                  <div className='flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3'>
                    <div className='flex items-center gap-2'>
                      <IconCoffee className='h-4 w-4 text-green-600' />
                      <span className='text-sm font-medium text-green-800'>
                        With Breakfast
                      </span>
                    </div>
                    <span className='font-bold text-green-700'>
                      {room.roomType.priceWithBreakfast.toLocaleString()} Ks
                    </span>
                  </div>

                  {/* Without Breakfast */}
                  <div className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3'>
                    <div className='flex items-center gap-2'>
                      <IconX className='h-4 w-4 text-gray-600' />
                      <span className='text-sm font-medium text-gray-700'>
                        Without Breakfast
                      </span>
                    </div>
                    <span className='font-bold text-gray-700'>
                      {room.roomType.priceWithoutBreakfast.toLocaleString()} Ks
                    </span>
                  </div>

                  {/* Price Difference */}
                  {room.roomType.priceWithBreakfast >
                    room.roomType.priceWithoutBreakfast && (
                    <div className='text-center'>
                      <span className='text-muted-foreground text-xs'>
                        Save{" "}
                        {(
                          room.roomType.priceWithBreakfast -
                          room.roomType.priceWithoutBreakfast
                        ).toLocaleString()}{" "}
                        Ks without breakfast
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
