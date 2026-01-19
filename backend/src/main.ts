import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://kobe-dash.vercel.app',
      /\.vercel\.app$/,
    ],
    methods: ['GET'],
    credentials: false,
  })

  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
