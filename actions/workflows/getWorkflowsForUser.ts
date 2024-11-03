"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export default async function getWorkflowsForUser() {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  return prisma.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
