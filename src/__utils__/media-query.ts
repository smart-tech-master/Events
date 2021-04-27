import mediaQuery from 'css-mediaquery'

export const setWindowMatchMedia = () => {
  //@ts-ignore
  window.matchMedia = createMatchMedia(window.innerWidth)
}

function createMatchMedia(width: number) {
  return (query: string) => {
    return {
      matches: mediaQuery.match(query, {width}),
      addListener: () => {},
      removeListener: () => {},
    }
  }
}
