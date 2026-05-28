import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/user/auth/jwt.module'
import { EtudiantModule } from './modules/etudiant/etudiant.module'
import { FiliereModule } from './modules/filiere/filiere.module'
import { TableModule } from './modules/table/table.module'
import { ClasseModule } from './modules/classe/classe.module'
import { NiveauModule } from './modules/niveau/niveau.module'
import { VagueModule } from './modules/vague/vague.module'
import { QrcodeModule } from './modules/qrcode/qrcode.module'
import { ScanModule } from './modules/scan/scan.module'
import { PayementModule } from './modules/payement/payement.module'
@Module({
  imports: [
    UserModule,
    AuthModule,
    EtudiantModule,
    FiliereModule,
    TableModule,
    ClasseModule,
    NiveauModule,
    VagueModule,
    QrcodeModule,
    ScanModule,
    PayementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
