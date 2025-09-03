import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "@/actions/translation.actions";

const translations = await getTranslations([
  "sign_in",
  "password",
  "register",
  "back",
  "name",
]);

export default function SignUp() {
  return (
    <div className="container mx-auto p-4 max-w-[750px]">
      <Card>
        <CardHeader>
          <CardTitle>{translations["register"]}</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm translations={translations} />
        </CardContent>
      </Card>
    </div>
  );
}
