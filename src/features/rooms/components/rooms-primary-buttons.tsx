import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconPlus,
  IconSearch,
  IconFilter,
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
    <div className='space-y-6 py-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Room Management</h1>
          <p className='text-muted-foreground'>
            Manage your hotel rooms efficiently
          </p>
        </div>
        <Button onClick={() => setOpen("add")} className='gap-2'>
          <IconPlus className='h-4 w-4' />
          Add Room
        </Button>
      </div>

      {/* Filters */}
      <div className='flex flex-col gap-4 sm:flex-row'>
        <div className='relative flex-1'>
          <IconSearch className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder='Search rooms...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select value={roomType} onValueChange={setRoomType}>
          <SelectTrigger className='w-full sm:w-48'>
            <IconFilter className='mr-2 h-4 w-4' />
            <SelectValue placeholder='All Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='available'>Available</SelectItem>
            <SelectItem value='notAvailable'>Not Available</SelectItem>
            <SelectItem value='booked'>Booked</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className='w-full sm:w-36'>
            <IconAdjustmentsHorizontal className='mr-2 h-4 w-4' />
            <SelectValue placeholder='Sort' />
          </SelectTrigger>
          <SelectContent align='end'>
            <SelectItem value='ascending'>
              <div className='flex items-center gap-2'>
                <IconSortAscendingLetters size={16} />
                <span>Ascending</span>
              </div>
            </SelectItem>
            <SelectItem value='descending'>
              <div className='flex items-center gap-2'>
                <IconSortDescendingLetters size={16} />
                <span>Descending</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
