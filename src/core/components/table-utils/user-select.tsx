/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useApiCall } from "@/core/utils/api-config";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { Select, SelectOption, Text, Avatar } from "rizzui";
import { useAtom, useSetAtom } from "jotai";
import { userActionsAtom, usersAtom } from "@/store/atoms/users.atom";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/core/ui/skeleton";

export function UserSelect({
  toUpdate = "assignedTo",
  assignedTo,
  method = "PATCH",
  endpoint,
  revalidatePath,
  placeholder = "Select User",
}: {
  placeholder?: string;
  toUpdate?: string;
  assignedTo?: string | { _id: string; name: string };
  method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  revalidatePath?: string[];
}) {
  const { data: session, status } = useSession();
  const [users] = useAtom(usersAtom);
  const setUsers = useSetAtom(userActionsAtom);
  const [value, setValue] = useState<SelectOption | undefined>();
  const { apiCall } = useApiCall();

  // Fetch users when component mounts and session is available
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.accessToken &&
      !users?.length
    ) {
      setUsers({
        type: "fetchAll",
        token: session.user.accessToken,
      });
    }
  }, [users, session?.user?.accessToken, status, setUsers]);

  const userOptions: SelectOption[] = useMemo(() => {
    return users
      .filter((user) => user._id)
      .map((user) => ({
        label: user.name,
        value: user._id as string,
      }));
  }, [users]);

  // Determine the selected user's ID
  const selectedUserId =
    typeof assignedTo === "string" ? assignedTo : assignedTo?._id;

  useEffect(() => {
    const selectedUser = userOptions.find(
      (option) => option.value === selectedUserId
    );

    if (selectedUser && selectedUser.value !== value?.value) {
      setValue(selectedUser);
    }
  }, [selectedUserId, userOptions, value?.value]);

  const handleStatusChange = async (selectedOption: SelectOption) => {
    try {
      const response = await apiCall<{ message: string }>({
        url: endpoint,
        method,
        data: { [toUpdate]: selectedOption.value },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setValue(selectedOption);
        if (revalidatePath) {
          await Promise.all(
            revalidatePath.map((path) =>
              fetch(path, {
                method: "GET",
              })
            )
          );
        }
      }
    } catch (error) {
      toast.error("Failed to update user assignment");
      console.error("Failed to update user assignment : ", error);
    }
  };

  // Render loading or error states
  if (status === "loading" || !users?.length)
    return <Skeleton className="h-10 w-full rounded" />;
  if (!session?.user?.accessToken) return <Text>Not authenticated</Text>;

  return (
    <Select
      dropdownClassName="!z-10"
      className="min-w-[140px]"
      placeholder={placeholder}
      options={userOptions}
      value={value ?? null}
      onChange={(newValue: SelectOption) => {
        setValue(newValue);
        handleStatusChange(newValue);
      }}
      displayValue={(option: { label: any }) =>
        renderOptionDisplayValue(option.label as string)
      }
    />
  );
}

function renderOptionDisplayValue(value: string) {
  return (
    <div className="flex items-center">
      <Avatar name={value} className="text-base" size="sm" />
      <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
        {value}
      </Text>
    </div>
  );
}
