import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export class AssignPayementDto {
  @IsString()
  @IsNotEmpty()
  id_etudiant!: number

  @IsNumber()
  @Min(0)
  montant!: number
}
