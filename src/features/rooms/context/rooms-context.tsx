import React, { useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { Room } from "../data/schema";

type RoomsDialogType = "add" | "edit" | "delete";

interface RoomsContextType {
  open: RoomsDialogType | null;
  setOpen: (str: RoomsDialogType | null) => void;
  currentRow: Room | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Room | null>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  roomType: string;
  setRoomType: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const RoomsContext = React.createContext<RoomsContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function RoomsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<RoomsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Room | null>(null);

  const [sort, setSort] = useState("ascending");
  const [roomType, setRoomType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <RoomsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        sort,
        setSort,
        roomType,
        setRoomType,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </RoomsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRooms = () => {
  const roomsContext = React.useContext(RoomsContext);

  if (!roomsContext) {
    throw new Error("useRooms has to be used within <RoomsContext>");
  }

  return roomsContext;
};
