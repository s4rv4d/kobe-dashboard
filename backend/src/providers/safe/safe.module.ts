import { Module } from '@nestjs/common'
import { SafeApiService } from './safe.service'

@Module({
  providers: [SafeApiService],
  exports: [SafeApiService],
})
export class SafeModule {}
