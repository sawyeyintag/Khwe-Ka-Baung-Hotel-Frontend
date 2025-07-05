import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { SessionsDialogs } from "./components/sessions-dialogs";
import { SessionsPrimaryButtons } from "./components/sessions-primary-buttons";
import { SessionsTable } from "./components/sessions-table";
import SessionsProvider from "./context/sessions-context";

export default function Sessions() {
  return (
    <SessionsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Session List</h2>
            <p className='text-muted-foreground'>Manage your sessions here.</p>
          </div>
          <SessionsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <SessionsTable />
        </div>
      </Main>

      <SessionsDialogs />
    </SessionsProvider>
  );
}
