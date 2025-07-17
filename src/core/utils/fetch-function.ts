type FetchOptions = {
  endpoint: string;
  accessToken?: string;
  tag?: string;
  cache?: RequestCache;
};

export const fetchData = async <T>({
  endpoint,
  accessToken,
  tag,
  cache = "no-store",
}: FetchOptions): Promise<T | []> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URI}${endpoint}`,
      {
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        ...(tag && {
          next: { tags: [tag] },
        }),
        cache,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${tag || endpoint}: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${tag || endpoint}:`, error);
    return [];
  }
};
