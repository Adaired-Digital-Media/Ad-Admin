/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiRequestConfig {
  url: string;
  method?: HttpMethod;
  data?: unknown;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

/**
 * Custom hook to make API calls with authentication headers on the client side
 * @returns A function to perform API calls and session status
 */
export const useApiCall = () => {
  const { data: session, status } = useSession();

  const apiCall = useCallback(
    async <T>({
      url,
      method = "GET",
      data,
      params,
      headers = {},
    }: ApiRequestConfig): Promise<AxiosResponse<T>> => {
      if (status === "loading") {
        throw new Error("Session is still loading, please wait.");
      }

      try {
        const accessToken = session?.user?.accessToken;

        const axiosInstance = axios.create({
          baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URI,
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
            ...headers,
          },
        });

        const config: AxiosRequestConfig = {
          url,
          method,
          data,
          params,
        };

        const response = await axiosInstance(config);
        return response;
      } catch (error) {
        console.log("API Error:", error);
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.message || error.message);
        }
        throw new Error("An unexpected error occurred");
      }
    },
    [session, status]
  );

  return { apiCall, sessionStatus: status };
};
