import { useRooms } from "../context/rooms-context";
import { RoomsActionDialog } from "./rooms-action-dialog";
import { RoomsDeleteDialog } from "./rooms-delete-dialog";

export function RoomsDialogs() {
  const { open, setOpen, currentRoom, setCurrentRoom } = useRooms();
  return (
    <>
      <RoomsActionDialog
        key='room-add'
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRoom && (
        <>
          <RoomsActionDialog
            key={`room-edit-${currentRoom.roomNumber}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRoom(null);
              }, 500);
            }}
            currentRoom={currentRoom}
          />

          <RoomsDeleteDialog
            key={`rooms-delete-${currentRoom.roomNumber}`}
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRoom(null);
              }, 500);
            }}
            currentRoom={currentRoom}
          />
        </>
      )}
    </>
  );
}
