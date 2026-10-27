import { NextResponse } from "next/server";
import { getSession } from "@/lib/actions";
import { cookies } from "next/headers";

export async function PATCH(
  req: Request,
  ) {
  try {    
    (await cookies()).delete("apiToken");
    const session = await getSession();
    session.destroy();
    return NextResponse.json('');
  } catch (error) {
    console.log('[USERS_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

