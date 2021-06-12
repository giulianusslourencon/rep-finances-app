import { GetStaticProps } from 'next'

import { BalancePage, BalancePageProps } from '@components/pages/BalancePage'

import API from '@utils/api'

export const getStaticProps: GetStaticProps<BalancePageProps> = async () => {
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
    props,
    revalidate: 15
  }
}

export default BalancePage
