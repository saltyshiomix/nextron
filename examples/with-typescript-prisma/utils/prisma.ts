import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
prisma.$connect();

export default prisma;
