import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { prisma } from "../lib/prisma"
import { openai } from "../lib/openai"

export async function generateAICompletionRoute(app: FastifyInstance) {
    app.post('/ai/generate', async (req, reply) => {
        const bodySchema = z.object({
            fileId: z.string().uuid(),
            template: z.string(),
            temperature: z.number().min(0).max(1).default(.5),
        })
        const { fileId, template, temperature } = bodySchema.parse(req.body)

        const file = await prisma.video.findUniqueOrThrow({
            where: {
                id: fileId,
            }
        })

        if (!file.transcription) {
            // return reply.status(400).send({ error: 'Video transcription has not been generated.' })
            file.transcription = 'I have made this place a sanctum of healing and salvation. Why do you threaten it?'
        }

        const promptMessage = template.replace('{transcription}', file.transcription)

        // If the transcription is short (has few tokens in request + response), you can use gpt-3.5-turbo
        // Otherwise, you can use gpt-3.5-turbo-16k for example (more expensive)
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            temperature,
            messages: [
                { role: 'user', content: promptMessage }
            ],
        })

        return response

    })
}
