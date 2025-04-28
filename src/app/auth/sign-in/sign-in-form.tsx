"use client";

import Link from "next/link";
import { SubmitHandler } from "react-hook-form";
import { Password, Checkbox, Button, Input, Text } from "rizzui";
import { useMedia } from "@core/hooks/use-media";
import { Form } from "@core/ui/form";
import { routes } from "@/config/routes";
import { loginSchema, LoginSchema } from "@/validators/login.schema";
import { signIn } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const initialValues: LoginSchema = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function SignInForm() {
  const router = useRouter();
  const isMedium = useMedia("(max-width: 1200px)", false);
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (error === "CredentialsSignin") {
      router.replace(routes.auth.signIn);
      setError(null);
      toast.error("Invalid credentials!");
    }
  }, [error, router]);

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    signIn("credentials", {
      ...data,
    });
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={initialValues}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({
          register,
          formState: {
            errors,
            isSubmitting,
            isLoading,
            isSubmitted,
            isSubmitSuccessful,
          },
        }) => (
          <div className="space-y-5 lg:space-y-6">
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
              isLoading={
                isSubmitting || isLoading || isSubmitted || isSubmitSuccessful
              }
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
