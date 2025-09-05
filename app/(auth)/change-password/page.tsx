import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cookies } from "next/headers";
import { getUserFromSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getCachedTranslations } from "@/actions/translation.helper";

const translations = await getCachedTranslations([
  "back",
  "old_password",
  "new_password",
  "confirm_password",
  "change_password",
  "update",
  "password_short",
  "old_password_required",
  "new_password_same",
  "passwords_dont_match",
]);

export default async function ChangePassword({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const token = params["token"] as string | undefined;

  if (!token) {
    const cookieStore = await cookies();
    const user = await getUserFromSession(cookieStore);
    if (!user) redirect("/");
  }

  return (
    <div className="container mx-auto p-4 max-w-[750px]">
      <Card>
        <CardHeader>
          <CardTitle>{translations["change_password"]}</CardTitle>
          <Separator className="mt-4"></Separator>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm translations={translations} token={token} />
        </CardContent>
      </Card>
    </div>
  );
}
