import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AssignQrcodeDto {
  @IsString()
  @IsNotEmpty()
  id_etudiant!: number

  @IsString()
  @IsNotEmpty()
  token!: string

  @IsOptional()
  @IsString()
  photoBase64?: string
}
