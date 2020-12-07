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

  hr {
    height: 2;
    margin: 0 16px;
  }

  hr.lineAmongButtons {
    color: ${props => props.theme.colors.light};
  }

  hr.lineAmongBalance {
    color: ${props => props.theme.colors.primaryDark};
  }

  .individual_balance {
    padding: 16px;
    display: flex;
    justify-content: space-between;
  }

  .individual_balance .balance_id {
    display: flex;
    height: 72px;
    width: 72px;
    background-color: ${props => props.theme.colors.primaryLight};
    border-radius: 16px;
    align-items: center;
    justify-content: center;
    font-size: 56px;
  }

  .individual_balance .balance_amount {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: ${props => props.theme.colors.primaryDark};
    font-weight: 300;
  }

  .individual_balance .balance_amount.negative {
    color: ${props => props.theme.colors.danger};
  }

`
