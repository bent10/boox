export interface Pokemon {
  id: string
  image_url: string
  caption: string
  name: string
  hp: number
  set_name: string
}

export interface Result {
  id: string
  image_url: string
  image_alt: string
  hp: number
  name: string
  set_name: string
  caption: string
}
