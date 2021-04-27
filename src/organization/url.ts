import {useLocation} from 'react-router-dom'

export const useOrganizationUrl = () => {
  const location = useLocation()
  const paths = location.pathname.split('/')
  if (paths.length < 3) {
    return {
      isOrganizationRoute: false,
      slug: null,
    }
  }

  const slug = paths[2]
  const isOrganizationRoute = paths[1] === 'organization'
  return {
    isOrganizationRoute,
    slug,
  }
}
