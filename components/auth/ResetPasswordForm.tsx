"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertPasswordRequest } from "@/actions/auth.actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { resetPasswordSchema } from "@/lib/schemas";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

const ResetPasswordForm = ({
  translations,
}: {
  translations: Record<string, string>;
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    const result = await insertPasswordRequest(data);
    if (!result.success) {
      setMessage("");
      setError(result.error || "An error occurred");
      return;
    }

    setError("");
    setMessage(translations["reset_email_sent"]);
    console.log("Password reset token created:", result.token);

    setButtonDisabled(true);
    setTimeout(() => {
      setButtonDisabled(false);
    }, 60000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className="text-destructive">{error}</p>}
        {message && <p>{message}</p>}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <Button asChild variant="link">
            <Link href="/sign-in">&lt;&lt; {translations["back"]}</Link>
          </Button>
          <div className="flex gap-4 justify-end">
            <Button variant="secondary" type="submit" disabled={buttonDisabled}>
              {translations["reset_password"]}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
