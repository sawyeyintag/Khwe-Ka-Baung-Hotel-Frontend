"use client";

import { useState, useMemo, useCallback } from "react";
import { guestService } from "@/services/guest.service";
import { Guest } from "@/types/guest.type";
import { debounce } from "lodash";
import { Check, ChevronDown, Loader2, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface GuestSearchComboboxProps {
  onGuestSelect: (guest: Guest) => void;
  excludeGuestIds?: string[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  searchDelay?: number;
  minSearchLength?: number;
  maxResults?: number;
  // Optional callbacks for more control
  onSearchStart?: () => void;
  onSearchEnd?: () => void;
  onSearchError?: (error: Error) => void;
}

export function GuestSearchCombobox({
  onGuestSelect,
  excludeGuestIds = [],
  disabled = false,
  placeholder = "Search guests by name, NIC, or phone number",
  className,
  searchDelay = 300,
  minSearchLength = 2,
  maxResults = 10,
  onSearchStart,
  onSearchEnd,
  onSearchError,
}: GuestSearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string>("");

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        if (!term || term.length < minSearchLength) {
          setSearchResults([]);
          return;
        }

        setIsSearching(true);
        onSearchStart?.();

        try {
          const results = await guestService.searchGuests(term);
          const filteredResults = results
            .filter((guest) => !excludeGuestIds.includes(guest.uid))
            .slice(0, maxResults);

          setSearchResults(filteredResults);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Error searching guests:", error);
          onSearchError?.(error as Error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
          onSearchEnd?.();
        }
      }, searchDelay),
    [
      excludeGuestIds,
      minSearchLength,
      maxResults,
      onSearchStart,
      onSearchEnd,
      onSearchError,
      searchDelay,
    ]
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Handle guest selection
  const handleGuestSelect = useCallback(
    (guestId: string) => {
      const guest = searchResults.find((g) => g.uid === guestId);
      if (guest) {
        onGuestSelect(guest);
        setOpen(false);
        setSearchTerm("");
        setSearchResults([]);
        setSelectedGuestId("");
      }
    },
    [searchResults, onGuestSelect]
  );

  // Check if guest is already selected
  const isGuestExcluded = useCallback(
    (guestId: string) => excludeGuestIds.includes(guestId),
    [excludeGuestIds]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          aria-label='Search for guests'
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          <span className={cn(!searchTerm && "text-muted-foreground")}>
            {searchTerm || placeholder}
          </span>
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='min-w-xl' align='start'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {isSearching ? (
              <CommandEmpty>
                <div className='flex items-center justify-center py-6'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span className='text-muted-foreground ml-2 text-sm'>
                    Searching...
                  </span>
                </div>
              </CommandEmpty>
            ) : searchResults.length === 0 ? (
              <CommandEmpty>
                {searchTerm.length >= minSearchLength ? (
                  "No guests found."
                ) : (
                  <div className='flex flex-col items-center gap-2'>
                    <Search className='text-primary w-8' />
                    <p>
                      {`Type at least ${minSearchLength} characters to search...`}
                    </p>
                  </div>
                )}
              </CommandEmpty>
            ) : (
              <CommandGroup
                heading={`Found ${searchResults.length} guest${searchResults.length !== 1 ? "s" : ""}`}
              >
                {searchResults.map((guest) => {
                  const isExcluded = isGuestExcluded(guest.uid);

                  return (
                    <CommandItem
                      key={guest.uid}
                      value={guest.uid}
                      onSelect={handleGuestSelect}
                      disabled={isExcluded}
                      className={cn(
                        "cursor-pointer",
                        isExcluded && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <div className='flex w-full items-center gap-3'>
                        <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                          <User className='text-primary h-4 w-4' />
                        </div>
                        <div className='flex-1 text-left'>
                          <p className='text-sm font-medium'>{guest.name}</p>
                          <p className='text-muted-foreground text-xs'>
                            {guest.nicCardNum} • {guest.phone}
                          </p>
                          {guest.address && (
                            <p className='text-muted-foreground truncate text-xs'>
                              {guest.address}
                            </p>
                          )}
                        </div>
                        {isExcluded && (
                          <Badge variant='secondary' className='text-xs'>
                            Already added
                          </Badge>
                        )}
                        {selectedGuestId === guest.uid && (
                          <Check className='h-4 w-4' />
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
