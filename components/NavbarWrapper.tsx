import React from "react";
import { fetchCategories } from "@/actions/wordpress.actions";
import { getCachedTranslations } from "@/actions/translation.helper";
import Navbar from "./Navbar";
import { FullUser } from "@/actions/user.actions";
import UserCard from "./UserCard";

const categories = await fetchCategories();
const translations = await getCachedTranslations([
  "home_title",
  "search",
  "all_genres",
  "guest",
  "last_login",
  "favorites",
  "sign_in",
  "sign_out",
  "register",
  "change_password",
]);

const NavbarWrapper = async ({ user }: { user: FullUser | null }) => {
  return (
    <header className="w-full fixed shadow-primary-dark/50 shadow-md">
      <Navbar translations={translations} categories={categories}>
        <UserCard user={user} translations={translations}></UserCard>
      </Navbar>
    </header>
  );
};

export default NavbarWrapper;
