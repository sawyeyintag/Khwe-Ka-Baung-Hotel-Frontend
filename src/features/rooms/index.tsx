import { useEffect, useState } from "react";
import { useLoaderData } from "@tanstack/react-router";
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconCash,
  IconUser,
  IconStairs,
} from "@tabler/icons-react";
import { useRoomStore } from "@/stores/roomStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { RoomStatusIds } from "./data/roomStatus";

const appText = new Map<string, string>([
  ["all", "All"],
  ["booked", "Booked"],
  ["available", "Available"],
  ["notAvailable", "Not Available"],
]);

export default function Rooms() {
  const [sort, setSort] = useState("ascending");
  const [roomType, setRoomType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const rooms = useLoaderData({ from: "/_authenticated/rooms/" });

  const { roomList, setAllRooms } = useRoomStore((state) => state.room);

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
        ? room.statusId === 1
        : roomType === "available"
          ? room.statusId === 2
          : roomType === "notAvailable"
            ? room.statusId === 3
            : true
    )
    .filter((room) =>
      room.roomType.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Room Management</h1>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your rooms!
          </p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter apps...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger className='w-36'>
                <SelectValue>{appText.get(roomType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='booked'>Booked</SelectItem>
                <SelectItem value='available'>Available</SelectItem>
                <SelectItem value='notAvailable'>Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                <div className='flex items-center gap-4'>
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='descending'>
                <div className='flex items-center gap-4'>
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow-sm' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {filteredRoomList.map((room) => (
            <li
              key={room.roomNumber}
              className='rounded-lg border p-4 hover:shadow-md'
            >
              <div className='mb-8 flex items-center justify-between'>
                <div
                  className={`bg-muted flex size-10 items-center justify-center rounded-lg p-3`}
                >
                  {room.roomNumber}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className={`${room.statusId ? "border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900" : ""}`}
                >
                  {room.statusId ? RoomStatusIds[room.statusId] : "Unknown"}
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
      </Main>
    </>
  );
}
