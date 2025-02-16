import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const stageId: string | undefined = request.nextUrl.searchParams
    .get("stageId")
    ?.toString();
};
