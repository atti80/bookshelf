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
import { formatDistanceToNowStrict } from "date-fns";

const UserCard = async ({
  user,
  translations,
}: {
  user: FullUser | null;
  translations: Record<string, string>;
}) => {
  return (
    <Card className="max-w-900 w-[90%] xl:w-[80%] border-none">
      <CardHeader>
        <CardTitle>{user ? `${user.name}` : translations["guest"]}</CardTitle>
        <CardDescription>
          {user && (
            <p className="text-xs">{`${translations["last_login"]} ${
              user.lastLogin
                ? formatDistanceToNowStrict(user.lastLogin).concat(" ago")
                : "-"
            }`}</p>
          )}
        </CardDescription>
        <Separator></Separator>
      </CardHeader>
      {user ? (
        <CardContent>
          <Link href={"/?favourites=true"}>
            <div className="flex items-center justify-between">
              <span>{translations["favorites"]}</span>
              <span className="md:max-xl:hidden inline">
                {user.likes.length}
              </span>
            </div>
          </Link>
          {/* <div className="flex items-center justify-between">
            <span>Comments</span>
            <span className="md:max-xl:hidden inline">
              {user.comments.length}
            </span>
          </div> */}
        </CardContent>
      ) : (
        <></>
      )}
      <CardFooter className="flex-col gap-2">
        {user ? (
          <>
            <Button asChild variant="link">
              <Link href="/change-password">
                {translations["change_password"]}
              </Link>
            </Button>
            <LogOutButton text={translations["sign_out"]}></LogOutButton>
          </>
        ) : (
          <>
            <Button variant="secondary" asChild className="w-full">
              <Link href={"/sign-in"}>{translations["sign_in"]}</Link>
            </Button>
            <Button variant="secondary" asChild className="w-full">
              <Link href={"/sign-up"}>{translations["register"]}</Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserCard;
