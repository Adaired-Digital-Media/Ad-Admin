import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tags = searchParams.get("tags")?.split(",") || [];

  if (tags.length === 0) {
    return NextResponse.json(
      { error: "No tags provided for revalidation" },
      { status: 400 }
    );
  }

  await Promise.all(
    tags.map(async (tag) => {
      console.log(`Revalidating tag: ${tag}`);
      await revalidateTag(tag);
    })
  );

  return NextResponse.json({ revalidated: tags });
}
