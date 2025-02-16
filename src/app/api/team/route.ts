import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const teamId: string | undefined = request.nextUrl.searchParams
    .get("teamId")
    ?.toString();
};
