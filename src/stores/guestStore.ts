import { create } from "zustand";
import { Guest } from "@/features/guests/data/schema";

interface GuestState {
  guest: {
    guestList: Guest[];
    setAllGuests: (guests: Guest[]) => void;
    createGuest: (guest: Guest) => void;
    updateGuest: (guest: Guest) => void;
    deleteGuest: (guestId: string) => void;
  };
}

export const useGuestStore = create<GuestState>()((set) => {
  return {
    guest: {
      guestList: [],
      setAllGuests: (guests) =>
        set((state) => ({
          ...state,
          guest: { ...state.guest, guestList: guests },
        })),
      createGuest: (guest) =>
        set((state) => ({
          ...state,
          guest: {
            ...state.guest,
            guestList: [...state.guest.guestList, guest],
          },
        })),
      updateGuest: (guest) =>
        set((state) => ({
          ...state,
          guest: {
            ...state.guest,
            guestList: state.guest.guestList.map((g) =>
              g.uid === guest.uid ? guest : g
            ),
          },
        })),
      deleteGuest: (guestId) =>
        set((state) => ({
          ...state,
          guest: {
            ...state.guest,
            guestList: state.guest.guestList.filter((g) => g.uid !== guestId),
          },
        })),
    },
  };
});
