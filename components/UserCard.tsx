"use client";

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
import { hu } from "date-fns/locale";

const SITE_LANGUAGE = process.env.NEXT_PUBLIC_SITE_LANGUAGE;

function addHungarianAgo(distance: string) {
  if (!distance) return "";

  const units: Record<string, string> = {
    perc: "perccel",
    óra: "órával",
    nap: "nappal",
    hét: "héttel",
    hónap: "hónappal",
    év: "évvel",
  };

  for (const [unit, suffix] of Object.entries(units)) {
    if (distance.includes(unit)) {
      return distance.replace(unit, suffix) + " ezelőtt";
    }
  }

  return distance + " ezelőtt"; // fallback
}

const UserCard = ({
  user,
  translations,
  closePopover,
}: {
  user: FullUser | null;
  translations: Record<string, string>;
  closePopover?: () => void;
}) => {
  const handleClick = () => {
    if (closePopover) closePopover();
  };

  let timeDistance = "-";
  if (user?.lastLogin) {
    console.log(SITE_LANGUAGE);
    if (SITE_LANGUAGE === "hu") {
      timeDistance = addHungarianAgo(
        formatDistanceToNowStrict(user.lastLogin, {
          locale: hu,
        })
      );
    } else
      timeDistance = formatDistanceToNowStrict(user.lastLogin).concat(" ago");
  }

  return (
    <Card className="max-w-900 w-[90%] xl:w-[80%] border-none">
      <CardHeader>
        <CardTitle>{user ? `${user.name}` : translations["guest"]}</CardTitle>
        <CardDescription>
          {user && (
            <p className="text-xs">{`${translations["last_login"]} ${timeDistance}`}</p>
          )}
        </CardDescription>
        <Separator></Separator>
      </CardHeader>
      {user && (
        <CardContent>
          <Link href={"/?favourites=true"} onClick={handleClick}>
            <div className="flex items-center justify-between">
              <span>{translations["favorites"]}</span>
              <span className="md:max-xl:hidden inline">
                {user.likes.length}
              </span>
            </div>
          </Link>
        </CardContent>
      )}
      <CardFooter className="flex-col gap-2">
        {user ? (
          <>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/change-password" onClick={handleClick}>
                {translations["change_password"]}
              </Link>
            </Button>
            <LogOutButton
              text={translations["sign_out"]}
              closePopover={handleClick}
            ></LogOutButton>
          </>
        ) : (
          <>
            <Button variant="secondary" asChild className="w-full">
              <Link href={"/sign-in"} onClick={handleClick}>
                {translations["sign_in"]}
              </Link>
            </Button>
            <Button variant="secondary" asChild className="w-full">
              <Link href={"/sign-up"} onClick={handleClick}>
                {translations["register"]}
              </Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserCard;
