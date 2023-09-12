import { FastifyInstance } from "fastify";
import { createReadStream } from 'node:fs'
import { z } from 'zod'
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export async function createTranscriptionRoute(app: FastifyInstance) {
    app.post('/files/:fileId/transcription', async (req) => {
        const paramsSchema = z.object({
            fileId: z.string().uuid(),
        })
        const { fileId } = paramsSchema.parse(req.params)

        const bodySchema = z.object({
            prompt: z.string(),
        })
        const { prompt } = bodySchema.parse(req.body)

        const file = await prisma.video.findUniqueOrThrow({
            where: {
                id: fileId,
            }
        })
        const filePath = file.path
        const fileReadStream = createReadStream(filePath)

        const response = await openai.audio.transcriptions.create({
            file: fileReadStream,
            model: 'whisper-1',
            language: 'en',
            response_format: 'json',
            temperature: 0,
            prompt,
        })

        const transcription = response.text
        await prisma.video.update({
            where: {
                id: fileId,
            },
            data: {
                transcription,
            }
        })

        return { transcription }
    })
}
