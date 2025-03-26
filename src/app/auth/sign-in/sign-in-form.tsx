"use client";

import Link from "next/link";
import { SubmitHandler } from "react-hook-form";
import { Password, Checkbox, Button, Input, Text } from "rizzui";
import { useMedia } from "@core/hooks/use-media";
import { Form } from "@core/ui/form";
import { routes } from "@/config/routes";
import { loginSchema, LoginSchema } from "@/validators/login.schema";
import { signIn } from "next-auth/react";
import { useState } from "react";

const initialValues: LoginSchema = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function SignInForm() {
  const isMedium = useMedia("(max-width: 1200px)", false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    console.log(data);
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl: routes.root.dashboard
    });

    if (result?.error) {
      // Display error message if authentication fails
      setErrorMessage("Invalid email or password. Please try again.");
    } else if (result?.ok) {
      // Optionally handle success (e.g., manual redirect)
      window.location.href = routes.root.dashboard;
    }
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={initialValues}
        onSubmit={onSubmit}
        useFormProps={{
          mode: "onChange",
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5 lg:space-y-6">
            {errorMessage && (
              <Text className="text-red-500 text-center">{errorMessage}</Text>
            )}
            <Input
              type="email"
              size={isMedium ? "lg" : "xl"}
              label="Email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              {...register("email")}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size={isMedium ? "lg" : "xl"}
              className="[&>label>span]:font-medium"
              {...register("password")}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between pb-1">
              <Checkbox
                {...register("rememberMe")}
                label="Remember Me"
                className="[&>label>span]:font-medium"
              />
              <Link
                href={routes.auth.forgotPassword}
                className="h-auto p-0 text-sm font-semibold text-gray-700 underline transition-colors hover:text-primary hover:no-underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              className="w-full"
              type="submit"
              size={isMedium ? "lg" : "xl"}
            >
              Sign In
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 md:mt-7 lg:mt-9 lg:text-base">
        Don’t have an account?{" "}
        <Link
          href={routes.auth.signUp}
          className="font-semibold text-gray-700 transition-colors hover:text-primary"
        >
          Sign Up
        </Link>
      </Text>
    </>
  );
}
