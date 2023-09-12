import { fastify } from 'fastify'

const app = fastify()

app.get('/', () => {
    return 'Hi :)'
})

app.listen({
    port: 3330,
}).then(() => {
    console.log('HTTP Server Running!')
})
