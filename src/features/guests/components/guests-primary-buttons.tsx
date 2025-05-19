import { IconUserPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useGuests } from "../context/guests-context";

export function GuestsPrimaryButtons() {
  const { setOpen } = useGuests();
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen("add")}>
        <span>Add Guest</span> <IconUserPlus size={18} />
      </Button>
    </div>
  );
}
