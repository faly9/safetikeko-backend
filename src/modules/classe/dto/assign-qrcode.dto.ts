import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class AssignQrcodeDto {
  @IsNumber()
  @IsNotEmpty()
  id_etudiant!: number

  @IsString()
  @IsNotEmpty()
  token!: string

  @IsOptional()
  @IsString()
  photoBase64?: string
}
