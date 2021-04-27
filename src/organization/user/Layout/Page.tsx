import Container from '@material-ui/core/Container'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'

export default withStyles({
  root: {
    paddingTop: spacing[6],
    paddingBottom: spacing[8],
  },
})(Container)
