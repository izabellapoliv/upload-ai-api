import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { getAllPromptsRoute } from './routes/get-all-prompts'
import { uploadFileRoute } from './routes/upload-file'
import { createTranscriptionRoute } from './routes/create-transcription'
import { generateAICompletionRoute } from './routes/generate-ai-completion'

const app = fastify()

app.register(fastifyCors, {
    origin: '*', // TODO: Replace this with the exact URL for the frontend application
})

app.register(getAllPromptsRoute)
app.register(uploadFileRoute)
app.register(createTranscriptionRoute)
app.register(generateAICompletionRoute)

app.listen({
    port: 3330,
}).then(() => {
    console.log('HTTP Server Running!')
})
