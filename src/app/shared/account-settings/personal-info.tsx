/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { SubmitHandler } from "react-hook-form";
import { PiEnvelopeSimple, PiSealCheckFill } from "react-icons/pi";
import { Form } from "@core/ui/form";
import { Title, Text, Input } from "rizzui";
import cn from "@core/utils/class-names";
import toast from "react-hot-toast";
import {
  defaultValues,
  profileFormSchema,
  ProfileFormTypes,
} from "@/validators/profile-settings.schema";
import FormGroup from "@/app/shared/form-group";
import FormFooter from "@core/components/form-footer";
import UploadZone from "@core/ui/file-upload/upload-zone";
import { useApiCall } from "@/core/utils/api-config";
import { useSession } from "next-auth/react";
import InputLoader from "@/core/components/loader/input-loader";
import UploadLoader from "@/core/components/loader/uploadzone-loader";

export default function ProfileSettingsView() {
  const { apiCall } = useApiCall();
  const { data: session, status, update } = useSession();

  const defaultValuesWithSession = {
    ...defaultValues,
    first_name: session?.user.name?.split(" ")[0] || "",
    last_name: session?.user.name?.split(" ")[1] || "",
    username: session?.user?.userName || "",
    email: session?.user?.email || "",
    image: session?.user?.image || "",
  };

  const onSubmit: SubmitHandler<ProfileFormTypes> = async (data) => {
    try {
      toast.loading("Updating profile...", { id: "profile-update" });

      // 1. Update in database
      const response = await apiCall<{ message: string; data: any }>({
        url: `/user/update`,
        method: "PATCH",
        data: {
          name: `${data.first_name} ${data.last_name}`,
          image: data.image,
          userName: data.username,
        },
      });

      if (response.status !== 200) {
        throw new Error("Database update failed");
      }

      const updatedUser = response?.data?.data;
      console.log("Updated User -> ", updatedUser);

      // 2. Update local session
      const updateResult = await update({
        user: {
          ...session?.user,
          name: updatedUser.name,
          userName: updatedUser.userName,
          image: updatedUser.image,
        },
      });

      console.log("Updated Session -> ", updateResult);

      if (!updateResult) {
        throw new Error("Session update failed");
      }
      // 3. Force a full session refresh to update the JWT cookie
      await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include", // Include cookies
      });

      toast.success("Profile updated successfully!", { id: "profile-update" });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile", { id: "profile-update" });
    }
  };
  return (
    <Form<ProfileFormTypes>
      validationSchema={profileFormSchema}
      onSubmit={onSubmit}
      className="@container"

      resetValues={defaultValuesWithSession}
    >
      {({ register, setValue, getValues, watch, formState: { errors } }) => {

        return (
          <>
            <ProfileHeader
              image={session?.user?.image || ""}
              title={session?.user?.name || ""}
              description="Update your photo and personal details."
              status={status}
            />

            <div className="mx-auto mb-10 grid w-full max-w-screen-2xl gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title="Name"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                {status === "loading" ? (
                  <>
                    <InputLoader />
                    <InputLoader />
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="First Name"
                      {...register("first_name")}
                      error={errors.first_name?.message}
                      className="flex-grow"
                    />
                    <Input
                      placeholder="Last Name"
                      {...register("last_name")}
                      error={errors.last_name?.message}
                      className="flex-grow"
                    />
                  </>
                )}
              </FormGroup>

              <FormGroup
                title="Your Image"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                {status === "loading" ? (
                  <UploadLoader className="col-span-9"/>
                ) : (
                  <UploadZone
                    name={`image`}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    className="col-span-9"
                    image={getValues("image")}
                    error={errors.image?.message}
                  />
                )}
              </FormGroup>

              <FormGroup
                title="Username"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="col-span-full"
                  placeholder=""
                  prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                  {...register("username")}
                  error={errors.username?.message}
                  disabled
                />
              </FormGroup>

              <FormGroup
                title="Email Address"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="col-span-full"
                  prefix={
                    <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  }
                  type="email"
                  placeholder="georgia.young@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                  disabled
                />
              </FormGroup>
            </div>
            <FormFooter
              // isLoading={isLoading}
              altBtnText="Cancel"
              submitBtnText="Save"
            />
          </>
        );
      }}
    </Form>
  );
}

export function ProfileHeader({
  image,
  title,
  description,
  children,
  status,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  image?: string;
  status?: any;
}>) {
  return (
    <div
      className={cn(
        "relative z-0 -mx-4 px-4 pt-28 before:absolute before:start-0 before:top-0 before:h-40 before:w-full before:bg-gradient-to-r before:from-[#F8E1AF] before:to-[#F6CFCF] @3xl:pt-[190px] @3xl:before:h-[calc(100%-120px)] dark:before:from-[#bca981] dark:before:to-[#cbb4b4] md:-mx-5 md:px-5 lg:-mx-8 lg:px-8 xl:-mx-6 xl:px-6 3xl:-mx-[33px] 3xl:px-[33px] 4xl:-mx-10 4xl:px-10"
      )}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-wrap items-end justify-start gap-6 border-b border-dashed border-muted pb-10">
        <div className="relative -top-1/3 aspect-square w-[110px] overflow-hidden rounded-full border-[6px] border-white bg-gray-100 shadow-profilePic @2xl:w-[130px] @5xl:-top-2/3 @5xl:w-[150px] dark:border-gray-50 3xl:w-[200px]">
          <Image
            src={
              image ||
              `https://avatar.iran.liara.run/username?username=${title.split(" ")[0]}+${title.split(" ")[1]}`
            }
            alt="profile-pic"
            fill
            sizes="(max-width: 768px) 100vw"
            className="aspect-auto"
          />
        </div>
        <div>
          {status === "loading" ? (
            <InputLoader />
          ) : (
            <Title
              as="h2"
              className="mb-2 inline-flex items-center gap-3 text-xl font-bold text-gray-900"
            >
              {title}
              <PiSealCheckFill className="h-5 w-5 text-primary md:h-6 md:w-6" />
            </Title>
          )}

          {description ? (
            <Text className="text-sm text-gray-500">{description}</Text>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
