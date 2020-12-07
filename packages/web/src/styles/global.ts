import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.dark};
    height: 100vh;
    font-family: 'Nunito Sans', sans-serif;
    text-align: center;
  }

  #layout { 
    max-width: 350px; 
    margin: 40px auto; 
  }

  #buttons {
    background-color: ${props => props.theme.colors.primaryDark};
    border-radius: 32px 32px 0 0;
  }

  #container {
    background-color: ${props => props.theme.colors.secondary};
    border-radius: 32px;
    min-height: 400px;
  }

  #buttons + #container {
    border-radius: 0 0 32px 32px;
  }

  .headerButton {
    padding: 8px 0;
  }

  .headerButton a {
    display: table-cell;
    height: 48px;
    width: 350px;
    vertical-align: middle;

    color: ${props => props.theme.colors.light};
    text-transform: uppercase;
    text-decoration: none;
    font-size: 32px;
  }

  a:hover {
    text-decoration: underline;
  }

  hr.lineAmongButtons {
    height: 2;
    color: ${props => props.theme.colors.light};
    margin: 0 16px;    
  }
`
