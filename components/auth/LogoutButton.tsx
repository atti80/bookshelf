"use client";

import { Button } from "@/components/ui/button";
import { logOut } from "@/actions/auth.actions";

export function LogOutButton({
  text,
  closePopover,
}: {
  text?: string;
  closePopover?: () => void;
}) {
  const handleClick = () => {
    if (closePopover) closePopover();
  };

  return (
    <form action={logOut} className="w-full">
      <Button
        type="submit"
        className="w-full"
        variant="destructive"
        onClick={handleClick}
      >
        {text ?? "Sign out"}
      </Button>
    </form>
  );
}
