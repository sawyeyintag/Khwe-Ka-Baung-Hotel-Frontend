import { useGuests } from "../context/guests-context";
import { GuestsActionDialog } from "./guests-action-dialog";
import { GuestsDeleteDialog } from "./guests-delete-dialog";

export function GuestsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useGuests();
  return (
    <>
      <GuestsActionDialog
        key='user-add'
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          <GuestsActionDialog
            key={`user-edit-${currentRow.uid}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <GuestsDeleteDialog
            key={`user-delete-${currentRow.uid}`}
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
