import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

// Function which creates a user
export async function createUser(
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User | string> {
  try {
    const result = await prisma.user.create({
      data: {
        username,
        email,
        password,
        firstName,
        lastName,
      },
    });
    console.log("User created successfully.");
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUser(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function editUser(userId: number, body: Partial<User>) {
  try {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: body,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getAllUsers() {
  return [...(await prisma.user.findMany())];
}
