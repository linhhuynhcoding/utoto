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

    // Parse date from DD/MM/YYYY to Date object
    let dobDate: Date | undefined;
    if (extractedData.dob) {
      console.log("Raw DOB:", extractedData.dob);
      const parts = extractedData.dob.split('/');
      if (parts.length === 3) {
          const day = parseInt(parts[0].trim(), 10);
          const month = parseInt(parts[1].trim(), 10);
          const year = parseInt(parts[2].trim(), 10);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
             // Create date using numeric constructor (Local time usually, but safer than string)
             // Using UTC to avoid timezone shifts shifting the date back
             dobDate = new Date(Date.UTC(year, month - 1, day));
             console.log("Constructed Date (UTC):", dobDate);
          }
      }
    }
    
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
        // Sync dob to user profile if available
        ...(dobDate && !isNaN(dobDate.getTime()) ? { dob: dobDate } : {}),
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
