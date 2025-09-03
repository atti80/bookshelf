import { SignInForm } from "@/components/auth/SignInForm";
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
  "sign_in",
  "password",
  "register",
  "back",
]);

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>;
}) {
  const { oauthError } = await searchParams;

  return (
    <div className="container mx-auto p-4 max-w-[750px]">
      <Card>
        <CardHeader>
          <CardTitle>{translations["sign_in"]}</CardTitle>
          <Separator className="mt-4"></Separator>
          {oauthError && (
            <CardDescription className="text-destructive">
              {oauthError}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <SignInForm translations={translations} />
        </CardContent>
      </Card>
    </div>
  );
}
