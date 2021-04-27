import faker from 'faker'

export function sometimes<T>(fn: (attributes: T) => T) {
  return (attributes: T) => {
    if (faker.random.boolean()) {
      return attributes
    }

    return fn(attributes)
  }
}
