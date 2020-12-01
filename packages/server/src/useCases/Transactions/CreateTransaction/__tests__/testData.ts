export const transactionSuccess = {
  title: 'Compra 1',
  timestamp: 1606827266326,
  items: {
    item1: {
      value: 20,
        related_users: ['P', 'G']
    },
    item2: {
      value: 30,
        related_users: ['P']
    }
  },
  payers: {
    P: 50
  }
}

export const transactionDistinctValues = {
  title: 'Compra 1',
  timestamp: 1606829066326,
  items: {
    item1: {
      value: 20,
      related_users: ['P', 'G']
    },
    item2: {
      value: 20,
      related_users: ['P']
    }
  },
  payers: {
    P: 50
  }
}

export const transactionNoMoney = {
  title: 'Compra 1',
  timestamp: 1606832666326,
  items: {},
  payers: {}
}
  
export const transactionNegativeNull = {
  title: 'Compra 1',
  timestamp: 1606834466326,
  items: {
    item1: {
      value: -10,
      related_users: ['P', 'G']
    },
    item2: {
      value: 10,
      related_users: ['P']
    }
  },
  payers: {
    P: 0
  }
}