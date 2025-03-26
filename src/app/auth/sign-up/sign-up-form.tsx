"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler } from "react-hook-form";
import { Password, Checkbox, Button, Input, Text } from "rizzui";
import { useMedia } from "@core/hooks/use-media";
import { Form } from "@core/ui/form";
import { routes } from "@/config/routes";
import { SignUpSchema, signUpSchema } from "@/validators/signup.schema";
import PhoneNumber from "@/core/ui/phone-input";
import toast from "react-hot-toast";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  isAgreed: false,
};

export default function SignUpForm() {
  const isMedium = useMedia("(max-width: 1200px)", false);
  const { push } = useRouter();
  const [reset, setReset] = useState({});
  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/auth/register`,
        {
          name: `${data.firstName} ${data.lastName || ""}`,
          email: data.email,
          password: data.password,
          contact: data.phoneNumber,
        }
      );
      toast.success(response?.data?.message);
    } catch (error) {
      console.error("Failed to register user: " + error);
      throw new Error("Failed to register user: " + error);
    }
    push(routes.auth.signIn);
    setReset({ ...initialValues, isAgreed: false });
  };

  return (
    <>
      <Form<SignUpSchema>
        validationSchema={signUpSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, control, formState: { errors } }) => (
          <div className="space-y-5 lg:space-y-6">
            <div className="space-y-5 xs:space-y-0 xs:flex xs:justify-between xs:items-center xs:gap-5">
              <Input
                type="text"
                size={isMedium ? "lg" : "xl"}
                label="First Name"
                placeholder="Enter your first name"
                className="[&>label>span]:font-medium w-full"
                inputClassName="text-sm"
                {...register("firstName")}
                error={errors.firstName?.message}
              />
              <Input
                type="text"
                size={isMedium ? "lg" : "xl"}
                label="Last Name"
                placeholder="Enter your last name"
                className="[&>label>span]:font-medium w-full"
                inputClassName="text-sm"
                {...register("lastName")}
                error={errors.lastName?.message}
              />
            </div>
            <Input
              type="email"
              size={isMedium ? "lg" : "xl"}
              label="Email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              {...register("email")}
              error={errors.email?.message}
            />
            <div className="space-y-5 xs:space-y-0 xs:flex xs:justify-between xs:items-center xs:gap-5">
              <Password
                label="Password"
                placeholder="Enter your password"
                size={isMedium ? "lg" : "xl"}
                className="[&>label>span]:font-medium w-full"
                inputClassName="text-sm"
                {...register("password")}
                error={errors.password?.message}
              />
              <Password
                label="Confirm Password"
                placeholder="Enter confirm password"
                size={isMedium ? "lg" : "xl"}
                className="[&>label>span]:font-medium w-full"
                inputClassName="text-sm"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
            </div>

            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneNumber
                  {...field}
                  country="us"
                  size={isMedium ? "lg" : "xl"}
                  label="Phone Number"
                  preferredCountries={["us"]}
                  onChange={(value) => field.onChange(value)}
                  error={errors.phoneNumber?.message}
                  className="col-span-2"
                />
              )}
            />
            <div className="col-span-2 flex items-start text-gray-700">
              <Checkbox
                {...register("isAgreed")}
                className="[&>label.items-center]:items-start [&>label>div.leading-none]:mt-0.5 [&>label>div.leading-none]:sm:mt-0 [&>label>span]:font-medium"
                label={
                  <Text as="span" className="ps-1 text-gray-500">
                    By signing up you have agreed to our{" "}
                    <Link
                      href="/"
                      className="font-semibold text-gray-700 transition-colors hover:text-primary"
                    >
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link
                      href="/"
                      className="font-semibold text-gray-700 transition-colors hover:text-primary"
                    >
                      Privacy Policy
                    </Link>
                  </Text>
                }
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              size={isMedium ? "lg" : "xl"}
            >
              Create Account
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 md:mt-7 lg:mt-9 lg:text-base">
        Don’t have an account?{" "}
        <Link
          href={routes.auth.signIn}
          className="font-semibold text-gray-700 transition-colors hover:text-primary"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
