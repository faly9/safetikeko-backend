import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/user/auth/jwt.module'
import { EtudiantModule } from './modules/etudiant/etudiant.module'
@Module({
  imports: [UserModule, AuthModule, EtudiantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
