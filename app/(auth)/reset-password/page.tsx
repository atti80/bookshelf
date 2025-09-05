import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { getCachedTranslations } from "@/actions/translation.helper";

const translations = await getCachedTranslations([
  "back",
  "email_not_registered",
  "reset_password",
  "reset_email_sent",
  "unable_request_reset",
  "password_reset_emailsubject",
  "password_reset_emailbody",
  "invalid_email",
]);

export default async function ResetPassword() {
  return (
    <div className="container mx-auto p-4 max-w-[750px]">
      <Card>
        <CardHeader>
          <CardTitle>{translations["reset_password"]}</CardTitle>
          <Separator className="mt-4"></Separator>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm translations={translations} />
        </CardContent>
      </Card>
    </div>
  );
}
