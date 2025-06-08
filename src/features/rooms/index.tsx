import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import RoomsCollections from "./components/rooms-collections";
import { RoomsDialogs } from "./components/rooms-dialogs";
import RoomsPrimaryButtons from "./components/rooms-primary-buttons";
import RoomsProvider from "./context/rooms-context";

export default function Rooms() {
  return (
    <RoomsProvider>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main>
        <>
          <RoomsDialogs />
          <RoomsPrimaryButtons />
          <RoomsCollections />
        </>
      </Main>
    </RoomsProvider>
  );
}
