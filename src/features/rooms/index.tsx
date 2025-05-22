import { Separator } from "@/components/ui/separator";
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
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Room Management</h1>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your rooms!
          </p>
          <RoomsDialogs />
          <RoomsPrimaryButtons />
          <Separator className='shadow-sm' />
          <RoomsCollections />
        </div>
      </Main>
    </RoomsProvider>
  );
}
