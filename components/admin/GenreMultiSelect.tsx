// components/GenreMultiSelect.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { GenreItem, getGenres } from "@/actions/genre.actions";

interface GenreMultiSelectProps {
  value: GenreItem[];
  onChange: (value: GenreItem[]) => void;
}

export function GenreMultiSelect({ value, onChange }: GenreMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState<GenreItem[]>([]);

  useEffect(() => {
    async function fetchGenres() {
      setGenres(await getGenres());
    }
    fetchGenres();
  }, []);

  const toggleGenre = (genre: GenreItem) => {
    onChange(
      value.find((g) => g.id === genre.id)
        ? value.filter((g) => g.id !== genre.id)
        : [...value, genre]
    );
  };

  const removeGenre = (genre: GenreItem) => {
    onChange(value.filter((g) => g.id !== genre.id));
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className="w-full h-9 p-1 border border-input bg-background rounded-md flex flex-wrap items-center px-2 gap-1 cursor-pointer"
          >
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {value.map((genre) => (
                  <Badge key={genre.id} className="h-6 flex items-center gap-1">
                    {genre.name}
                    <Button
                      className="cursor-pointer w-6 h-6 rounded-full"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeGenre(genre);
                      }}
                    >
                      <X />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">
                Select genres...
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command
            filter={(value, search) => {
              if (value.toLowerCase().includes(search.toLowerCase())) return 1;
              return 0;
            }}
          >
            <CommandInput placeholder="Search genres..." />
            <CommandEmpty>No genre found.</CommandEmpty>
            <CommandList>
              <CommandGroup heading="Genres">
                {genres.map((genre) => (
                  <CommandItem
                    key={genre.id}
                    value={genre.name}
                    onSelect={() => toggleGenre(genre)}
                    className="flex justify-between items-center"
                  >
                    <span>{genre.name}</span>
                    {value.find((g) => g.id === genre.id) && (
                      <Check className="w-4 h-4 text-primary stroke-3" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
