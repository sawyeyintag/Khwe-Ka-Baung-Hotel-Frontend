import { useRooms } from "../context/rooms-context";
import { RoomsActionDialog } from "./rooms-action-dialog";
import { RoomsDeleteDialog } from "./rooms-delete-dialog";

export function RoomsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRooms();
  return (
    <>
      <RoomsActionDialog
        key='room-add'
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          <RoomsActionDialog
            key={`room-edit-${currentRow.roomNumber}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <RoomsDeleteDialog
            key={`rooms-delete-${currentRow.roomNumber}`}
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
