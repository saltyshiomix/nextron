import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      const user = (await prisma.user.findFirst({})) || {};
      res.status(200).json(user);
    } else if (req.method === "POST") {
      const data = req.body;

      if (data.name && typeof data.name === "string") {
        const user = await prisma.user.create({
          data: {
            name: data.name,
          },
        });
        res.status(201).json(user);
      } else {
        throw new Error("Request method is not supported");
      }
    }
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
