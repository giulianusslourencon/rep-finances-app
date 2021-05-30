import {
  TransactionHistoryPage,
  TransactionHistoryPageProps
} from '@components/TransactionHistoryPage'

import API from '@utils/api'

TransactionHistoryPage.getInitialProps = async ({ query }) => {
  const page = parseInt(query.page?.toString() || '1')

  const itemsPerPage = 15

  const props: TransactionHistoryPageProps = {
    transactions: [],
    paginationProps: {
      curPage: page,
      itemsCount: 0,
      firstIndex: (page - 1) * itemsPerPage + 1,
      lastIndex: 15
    }
  }

  try {
    const countResponse = await API.countTransactions()
    props.paginationProps.itemsCount = countResponse.data.count
    props.paginationProps.lastIndex = Math.min(
      props.paginationProps.itemsCount,
      props.paginationProps.firstIndex + itemsPerPage - 1
    )

    const response = await API.listTransactions(page)
    props.transactions = response.data
  } catch (error) {
    const errorMessage = error.response?.data || {
      name: error.code,
      message: error.message
    }
    props.error = errorMessage
  }

  return props
}

export default TransactionHistoryPage
