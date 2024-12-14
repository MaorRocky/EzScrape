"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteCredential(name: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await prisma.credential.delete({
    where: {
      name_userId: {
        name,
        userId,
      },
    },
  });

  revalidatePath("/credentials");
}
