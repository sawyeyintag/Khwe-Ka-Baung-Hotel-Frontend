import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconPlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRooms } from "../context/rooms-context";

const roomText = new Map<string, string>([
  ["all", "All"],
  ["booked", "Booked"],
  ["available", "Available"],
  ["notAvailable", "Not Available"],
]);

export default function RoomsPrimaryButtons() {
  const {
    searchTerm,
    setSearchTerm,
    roomType,
    setRoomType,
    sort,
    setSort,
    setOpen,
  } = useRooms();
  return (
    <>
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
              <SelectValue>{roomText.get(roomType)}</SelectValue>
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
        <Button className='space-x-1' onClick={() => setOpen("add")}>
          <span>Add Room</span> <IconPlus size={18} />
        </Button>
      </div>
    </>
  );
}
