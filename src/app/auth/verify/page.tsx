import AuthWrapper from "@/app/shared/auth-layout/auth-wrapper";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Verification"),
};

interface ErrorResponse {
  status: number;
  data: { message: string };
}

const verifyUser = async (token: string): Promise<ErrorResponse> => {
  const apiUri = process.env.NEXT_PUBLIC_BACKEND_API_URI;

  if (!apiUri) {
    console.error(
      "Backend API URI is not defined in the environment variables."
    );
    return {
      status: 500,
      data: { message: "Server configuration error. Please try again later." },
    };
  }

  try {
    const response = await fetch(`${apiUri}/auth/verify-user?token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        status: response.status,
        data: { message: errorData.message || "An unexpected error occurred." },
      };
    }

    return await response.json();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { status: 500, data: { message } };
  }
};

export default async function VerifyUser({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams?.token;

  if (!token) {
    return (
      <AuthWrapper title="Invalid or expired verification link.">
        <></>
      </AuthWrapper>
    );
  }

  const result = await verifyUser(token);

  return (
    <AuthWrapper title={result.data.message}>
      <></>
    </AuthWrapper>
  );
}
