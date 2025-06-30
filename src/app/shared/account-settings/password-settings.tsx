"use client";

import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Form } from "@core/ui/form";
import { Password } from "rizzui";
import { ProfileHeader } from "@/app/shared/account-settings/personal-info";
import HorizontalFormBlockWrapper from "@/app/shared/account-settings/horiozontal-block";
import {
  passwordFormSchema,
  PasswordFormTypes,
} from "@/validators/password-settings.schema";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import FormFooter from "@/core/components/form-footer";
import { useApiCall } from "@/core/utils/api-config";
import { useRouter } from "nextjs-toploader/app";
import { routes } from "@/config/routes";

export default function PasswordSettingsView() {
  const router = useRouter();
  const { apiCall } = useApiCall();
  const { data: session } = useSession();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const handleAltBtn = () => {
    router.push(routes.root.dashboard);
  };

  const onSubmit: SubmitHandler<PasswordFormTypes> = async (data) => {
    try {
      setLoading(true);

      const response = await apiCall<{ message: string }>({
        url: `/auth/reset-password`,
        method: "PATCH",
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to update password");
      }

      setReset({
        currentPassword: "",
        newPassword: "",
        confirmedPassword: "",
      });

      setLoading(false);
    } catch (error) {
      console.error("Password Update Error : ", error);
      toast.error("Failed to update password");
    }
  };

  return (
    <>
      <Form<PasswordFormTypes>
        validationSchema={passwordFormSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        className="@container"
      >
        {({ register, formState: { errors } }) => {
          return (
            <>
              <ProfileHeader
                image={session?.user?.image || ""}
                title={session?.user?.name || "Your Profile"}
                description="Update your password."
              />

              <div className="mx-auto w-full max-w-screen-2xl">
                <HorizontalFormBlockWrapper
                  title="Current Password"
                  titleClassName="text-base font-medium"
                >
                  <Password
                    {...register("currentPassword")}
                    placeholder="Enter your password"
                    error={errors.currentPassword?.message}
                  />
                </HorizontalFormBlockWrapper>

                <HorizontalFormBlockWrapper
                  title="New Password"
                  titleClassName="text-base font-medium"
                >
                  <Password
                    {...register("newPassword")}
                    placeholder="Enter your password"
                    error={errors.newPassword?.message}
                  />
                </HorizontalFormBlockWrapper>

                <HorizontalFormBlockWrapper
                  title="Confirm New Password"
                  titleClassName="text-base font-medium"
                >
                  <Password
                    {...register("confirmedPassword")}
                    placeholder="Enter your password"
                    error={errors.confirmedPassword?.message}
                  />
                </HorizontalFormBlockWrapper>

                <FormFooter
                  handleAltBtn={handleAltBtn}
                  isLoading={isLoading}
                  altBtnText="Cancel"
                  submitBtnText="Update Password"
                />
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
