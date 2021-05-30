import { GetServerSideProps } from 'next'

import { BalancePage, BalancePageProps } from '@components/BalancePage'

import API from '@utils/api'

export const getServerSideProps: GetServerSideProps<BalancePageProps> = async () => {
  const props: BalancePageProps = {
    balance: []
  }

  try {
    const response = await API.getCurrentBalance()
    const balance = response.data.balance

    props.balance = Object.entries(balance)
  } catch (error) {
    const errorMessage = error.response?.data || {
      name: error.code,
      message: error.message
    }
    props.error = errorMessage
  }

  return {
    props
  }
}

export default BalancePage
