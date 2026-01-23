import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TwitterController } from './twitter.controller';
import { UserService } from './user.service';
import { TwitterService } from './twitter.service';
import { SupabaseModule } from '../providers/supabase/supabase.module';
import { CacheModule } from '../providers/cache/cache.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SupabaseModule, CacheModule, AuthModule],
  controllers: [UserController, TwitterController],
  providers: [UserService, TwitterService],
  exports: [UserService],
})
export class UserModule {}
