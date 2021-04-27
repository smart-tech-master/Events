import {v4 as uuid} from 'uuid'

// Use this normalized entity list to reduce re-renders
// of cases where a list of entities should allow
// a single item to be editable individually.
export type EntityList<T> = {
  entities: Record<string, T>
  ids: string[]
}

export const createEntityList = <T>(items: T[]): EntityList<T> => {
  const list: EntityList<T> = {
    entities: {},
    ids: [],
  }

  for (const item of items) {
    const id = uuid()
    list.entities[id] = item
    list.ids.push(id)
  }

  return list
}
