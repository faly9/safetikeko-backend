export interface CreateClasseDto {
  mode: 'PRESENTIEL' | 'HYBRIDE'
  id_filiere: number
  id_niveau: number
  id_vague: number
  id_delegue: number
}
