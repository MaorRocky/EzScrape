"use server";
import { createCredentialSchema, CreateCredentialSchemaType } from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { symmetricEncrypt } from "@/lib/encryption";

export async function CreateCredential(form: CreateCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  const encryptedValue = symmetricEncrypt(data.value);
  const result = await prisma.credential.create({
    data: {
      name: data.name,
      value: encryptedValue,
      userId,
    },
  });

  if (!result) {
    throw new Error("failed to create credential");
  }

  revalidatePath("/credentials");
}
