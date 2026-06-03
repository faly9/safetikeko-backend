import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(bodyParser.urlencoded({ extended: true }))

  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })

  const port = process.env.PORT || 3000

  await app.listen(port, '0.0.0.0')
}

void bootstrap()
