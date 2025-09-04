"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "@/actions/auth.actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signInSchema } from "@/lib/schemas";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

export function SignInForm({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    const error = await signIn(data);
    setError(error);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className="text-destructive">{error}</p>}
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations["password"]}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="pr-10"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <Button asChild variant="link">
            <Link href="/">&lt;&lt; {translations["back"]}</Link>
          </Button>
          <div className="flex gap-4 justify-end">
            {/* <Button asChild variant="link">
              <Link href="/sign-up">{translations["register"]}</Link>
            </Button> */}
            <Button asChild variant="link">
              <Link href="/">Elfelejtett jelszó</Link>
            </Button>
            <Button variant="secondary" type="submit">
              {translations["sign_in"]}
            </Button>
          </div>
        </div>
      </form>
      {/* <div className="flex justify-end mt-4">
        <Button asChild variant="link">
          <Link href="/">Elfelejtett jelszo</Link>
        </Button>
      </div> */}
    </Form>
  );
}
