"use client";

import { Button } from "@/components/ui/button";
import { logOut } from "@/actions/auth.actions";

export function LogOutButton({ text }: { text?: string }) {
  return (
    <Button
      className="w-full"
      variant="destructive"
      onClick={async () => await logOut()}
    >
      {text ? text : "Sign out"}
    </Button>
  );
}
