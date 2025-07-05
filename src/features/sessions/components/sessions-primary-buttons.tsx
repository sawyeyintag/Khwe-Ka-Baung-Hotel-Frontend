import { IconUserPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useSessions } from "../context/sessions-context";

export function SessionsPrimaryButtons() {
  const { setOpen } = useSessions();
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen("add")}>
        <span>Add Session</span> <IconUserPlus size={18} />
      </Button>
    </div>
  );
}
