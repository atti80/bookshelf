import { SignInForm } from "@/components/auth/SignInForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "@/actions/translation.actions";
import { Separator } from "@/components/ui/separator";

const translations = await getTranslations([
  "sign_in",
  "password",
  "register",
  "back",
  "forgotten_password",
]);

export default async function SignIn() {
  return (
    <div className="container mx-auto p-4 max-w-[750px]">
      <Card>
        <CardHeader>
          <CardTitle>{translations["sign_in"]}</CardTitle>
          <Separator className="mt-4"></Separator>
        </CardHeader>
        <CardContent>
          <SignInForm translations={translations} />
        </CardContent>
      </Card>
    </div>
  );
}
