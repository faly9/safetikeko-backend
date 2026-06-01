import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class AssignPayementDto {
  @IsNumber()
  @IsNotEmpty()
  id_etudiant!: number

  @IsNumber()
  @Min(0)
  montant!: number
}
