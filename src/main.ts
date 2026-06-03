import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    origin: 'https://safetikeko-backoffice.vercel.app',
    credentials: true,
  })

  await app.listen(5000, '0.0.0.0')
}

void bootstrap()
