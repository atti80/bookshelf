import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "@/actions/translation.actions";
import { Separator } from "@/components/ui/separator";

const translations = await getTranslations([
  "back",
  "old_password",
  "new_password",
  "confirm_password",
  "change_password",
  "update",
]);

export default async function ChangePassword({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>;
}) {
  const { oauthError } = await searchParams;

  return (
    <div className="container mx-auto p-4 max-w-[750px]">
      <Card>
        <CardHeader>
          <CardTitle>{translations["change_password"]}</CardTitle>
          <Separator className="mt-4"></Separator>
          {oauthError && (
            <CardDescription className="text-destructive">
              {oauthError}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <ChangePasswordForm translations={translations} />
        </CardContent>
      </Card>
    </div>
  );
}
