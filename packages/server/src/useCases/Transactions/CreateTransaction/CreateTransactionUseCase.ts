import { DomainError } from '@entities/errors'
import { Transaction } from '@entities/Transaction'

import { IBalanceRepository } from '@repositories/ports/IBalanceRepository'
import { ITransactionsRepository } from '@repositories/ports/ITransactionsRepository'

import { TransactionProps } from '@shared/@types/Transaction'
import { Either, left, right } from '@shared/Either'

import { ICreateTransactionRequestDTO } from './CreateTransactionDTO'

export class CreateTransactionUseCase {
  /* eslint-disable prettier/prettier */
  constructor(
    private transactionsRepository: ITransactionsRepository,
    private balanceRepository: IBalanceRepository
  ) { }
  /* eslint-enable prettier/prettier */

  async execute(
    data: ICreateTransactionRequestDTO
  ): Promise<Either<Error & DomainError, TransactionProps>> {
    const transactionOrError = Transaction.create(data)

    if (transactionOrError.isLeft()) return left(transactionOrError.value)

    const transaction = transactionOrError.value

    await this.transactionsRepository.save(transaction)
    await this.balanceRepository.setNotUpdatedFromMonth(transaction.month)

    return right(transaction.value)
  }
}
