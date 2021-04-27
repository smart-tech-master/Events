import {createGlobalStyle} from 'styled-components'

const SimpleBlogStyles = createGlobalStyle<{primaryColor: string}>`

html, body, #root {
  height: 100%;
}

body {
  font-family: Arial, 'Times New Roman', Verdana;
  font-size: 17px;
}

a {
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

p {
  margin-top: 0;
  margin-bottom: ${(props) => props.theme.spacing[4]};
}

`

export default SimpleBlogStyles
