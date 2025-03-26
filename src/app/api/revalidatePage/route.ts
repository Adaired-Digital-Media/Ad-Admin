import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const path = body?.path;

    // Validate the slug
    if (!path) {
      return new NextResponse("Invalid request: Path is required", {
        status: 400,
      });
    }

    // Revalidate the path
    revalidatePath(String(path));

    return new NextResponse("Revalidation successful", {
      status: 200,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return new NextResponse("Failed to revalidate", {
      status: 500,
    });
  }
}
