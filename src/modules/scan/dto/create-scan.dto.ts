// scan/dto/create-scan.dto.ts
import { IsString, IsInt } from 'class-validator'

export class CreateScanDto {
  @IsString()
  token!: string // token du QR code scanné

  @IsInt()
  agent_id!: number
}
