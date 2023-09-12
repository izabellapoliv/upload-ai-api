import { fastify } from 'fastify'
import { prisma } from './lib/prisma'
import { getAllPromptsRoute } from './routes/get-all-prompts'
import { uploadFileRoute } from './routes/upload-file'
import { createTranscriptionRoute } from './routes/create-transcription'

const app = fastify()

app.register(getAllPromptsRoute)
app.register(uploadFileRoute)
app.register(createTranscriptionRoute)

app.listen({
    port: 3330,
}).then(() => {
    console.log('HTTP Server Running!')
})
