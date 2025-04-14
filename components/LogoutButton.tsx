"use client";

import { Button } from "@/components/ui/button";
import { logOut } from "@/actions/auth.actions";

export function LogOutButton() {
  return (
    <Button
      className="w-full"
      variant="destructive"
      onClick={async () => await logOut()}
    >
      Log Out
    </Button>
  );
}
