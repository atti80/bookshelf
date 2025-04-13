import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { getCurrentUser } from "@/actions/user.actions";
import { LogOutButton } from "./LogoutButton";

const UserCard = async () => {
  const user = await getCurrentUser({ withFullUser: true });

  return (
    <Card className="w-[70%] border-none">
      <CardHeader>
        <CardTitle>{user ? `${user.name}` : "Guest"}</CardTitle>
        <CardDescription>
          {user && `Role: ${user.isAdmin ? "admin" : "reader"}`}
        </CardDescription>
        <Separator></Separator>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        {user ? (
          <>
            {user.isAdmin && (
              <Button asChild variant="outline" className="w-full">
                <Link href={"/admin"}>Admin page</Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link href={"/private"}>Private page</Link>
            </Button>
            <LogOutButton></LogOutButton>
          </>
        ) : (
          <>
            <Button asChild className="w-full">
              <Link href={"/sign-in"}>Sign in</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href={"/sign-up"}>Sign up</Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserCard;
