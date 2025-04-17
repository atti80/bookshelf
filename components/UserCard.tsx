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
import { FullUser } from "@/actions/user.actions";
import { LogOutButton } from "./auth/LogoutButton";

const UserCard = async ({ user }: { user: FullUser | null }) => {
  return (
    <Card className="w-[70%] border-none">
      <CardHeader>
        <CardTitle>{user ? `${user.name}` : "Guest"}</CardTitle>
        <CardDescription>
          {user && `${user.isAdmin ? "admin" : "reader"}`}
        </CardDescription>
        <Separator></Separator>
      </CardHeader>
      {user ? (
        <CardContent>
          <Link href={"/favourites"}>
            <div className="flex items-center justify-between">
              <span>Favourites</span>
              <span>{user.likes.length}</span>
            </div>
          </Link>
          <div className="flex items-center justify-between">
            <span>Comments</span>
            <span>{user.comments.length}</span>
          </div>
        </CardContent>
      ) : (
        <></>
      )}
      <CardFooter className="flex-col gap-2">
        {user ? (
          <>
            {user.isAdmin && (
              <Button asChild variant="secondary" className="w-full">
                <Link href={"/admin"}>Admin page</Link>
              </Button>
            )}
            <Button asChild variant="secondary" className="w-full">
              <Link href={"/private"}>Private page</Link>
            </Button>
            <LogOutButton></LogOutButton>
          </>
        ) : (
          <>
            <Button variant="secondary" asChild className="w-full">
              <Link href={"/sign-in"}>Sign in</Link>
            </Button>
            <Button variant="secondary" asChild className="w-full">
              <Link href={"/sign-up"}>Sign up</Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserCard;
