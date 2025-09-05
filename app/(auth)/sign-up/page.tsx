import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCachedTranslations } from "@/actions/translation.helper";

const translations = await getCachedTranslations([
  "sign_in",
  "password",
  "register",
  "back",
  "name",
  "name_required",
  "invalid_email",
  "password_short",
]);

export default function SignUp() {
  return (
    <div className="container mx-auto p-4 max-w-[750px]">
      <Card>
        <CardHeader>
          <CardTitle>{translations["register"]}</CardTitle>
          <Separator className="mt-4"></Separator>
        </CardHeader>
        <CardContent>
          <SignUpForm translations={translations} />
        </CardContent>
      </Card>
    </div>
  );
}
