import { useSessions } from "../context/sessions-context";
import SessionsActionDialog from "./sessions-action-dialog";

export function SessionsDialogs() {
  const { open, setOpen } = useSessions();
  return (
    <>
      <SessionsActionDialog
        key='session-add'
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />
    </>
  );
}
