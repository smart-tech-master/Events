export const fetchFile = (name: string, url: string) =>
  fetch(url)
    .then((r) => r.blob())
    .then((blob) => {
      return new File([blob], name)
    })
