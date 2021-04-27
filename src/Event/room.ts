export interface Room {
  id: number
  name: string
  is_online: boolean
  max_num_attendees: number | null
}
