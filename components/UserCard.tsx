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

const UserCard = async () => {
  // const user = { name: "Attila Ven", isAdmin: true };
  const user = await getCurrentUser();

  return (
    <Card className="w-[70%] border-none">
      <CardHeader>
        <CardTitle>{user ? `${user.name}` : "Guest"}</CardTitle>
        <CardDescription>
          {user && `Role: ${user.isAdmin ? "admin" : "reader"}`}
        </CardDescription>
        <Separator></Separator>
      </CardHeader>

      {user ? (
        <CardFooter className="flex-col gap-2">
          {user.isAdmin && (
            <Button asChild variant="outline" className="w-full">
              <Link href={"/admin"}>Admin</Link>
            </Button>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link href={"/private"}>Private</Link>
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="flex-col gap-2">
          <Button asChild className="w-full">
            <Link href={"/sign-in"}>Sign in</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href={"/sign-up"}>Sign up</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UserCard;
