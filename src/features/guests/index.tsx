import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { UsersDialogs } from "./components/guests-dialogs";
import { GuestsPrimaryButtons } from "./components/guests-primary-buttons";
import { GuestsTable } from "./components/guests-table";
import GuestsProvider from "./context/guests-context";

export default function Users() {
  return (
    <GuestsProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Guest List</h2>
            <p className='text-muted-foreground'>Manage your guests here.</p>
          </div>
          <GuestsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <GuestsTable />
        </div>
      </Main>

      <UsersDialogs />
    </GuestsProvider>
  );
}
