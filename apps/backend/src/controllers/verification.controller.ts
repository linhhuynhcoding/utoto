import { FastifyReply, FastifyRequest } from "fastify";
import { fptService } from "@/services/fpt.service";
import prisma from "@/database";
import path from "path";
import envConfig from "@/config";
import fs from "fs";
import { pipeline } from "stream";
import util_promisify from "util";
const pump = util_promisify.promisify(pipeline);

export const verifyDrivingLicense = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const data = await request.file();
  if (!data) {
    return reply.status(400).send({ success: false, message: "No file uploaded" });
  }

  const userId = (request as any).user.id;
  const filename = `${userId}_${Date.now()}_${data.filename}`;
  const uploadDir = path.resolve(envConfig.UPLOAD_FOLDER);
  const filePath = path.join(uploadDir, filename);

  await pump(data.file, fs.createWriteStream(filePath));
  
  // Calculate public URL (assuming static serve is setup)
  // const fileUrl = `${envConfig.API_URL}/static/${filename}`;

  try {
    const extractedData = await fptService.extractDrivingLicense(filePath);

    // Update user in DB
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        driver_license_code: extractedData.id,
        driver_license_name: extractedData.name,
        driver_license_dob: extractedData.dob,
        driver_license_class: extractedData.class,
        driver_license_issue_date: extractedData.date,
        driver_license_expiry_date: extractedData.doe,
        // Save extracted raw data or verify flag?
        // For now just these fields.
        // We might want to verify if name matches user name?
      },
    });

    return reply.send({
      success: true,
      data: {
        extracted: extractedData,
        user: updatedUser,
      },
    });
  } catch (error: any) {
    return reply.status(500).send({ success: false, message: error.message });
  }
};
