import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export class AssignPayementDto {
  @IsString()
  @IsNotEmpty()
  matricule!: string

  @IsNumber()
  @Min(0)
  montant!: number
}
