import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const gpsSSEHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
     // Keep connection alive (prevents automatic close)
  reply.sse.keepAlive()

  // Send initial message
  await reply.sse.send({ data: 'Connected' })

  // Check if keepAlive was called
  console.log('Keep alive status:', reply.sse.shouldKeepAlive) // true
  
  // Set up periodic updates
  const interval = setInterval(async () => {
    if (reply.sse.isConnected) {
      console.log('Sending...')
      const data = 
      await reply.sse.send({ data: {
        "lat": 10.111111 ,
        "lng": 106.1111111 + Math.random()/Math.pow(10, 2) 
      }, event: "gps" })
      // await reply.sse.send({ data: {
      //   "lat": 10.111111 + Math.random()/Math.pow(10, 7) * (Math.round(Math.random()*10) % 2 == 0 ? -1 : 1),
      //   "lng": 106.1111111 + Math.random()/Math.pow(10, 7) * (Math.round(Math.random()*10) % 2 == 0 ? -1 : 1)
      // }})
    } else {
      clearInterval(interval)
    }
  }, 2000)

  // Clean up when connection closes
  reply.sse.onClose(() => {
    clearInterval(interval)
    console.log('Connection closed')
  })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        message: "Invalid input data",
        errors: error.errors,
      });
    }

    request.log.error(error);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
