import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import transaction from '../models/Transaction';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transactions = await transactionsRepository.findOne(id);

    if (!transactions) {
      throw new AppError('Transaction does not exist');
    }

    await transactionsRepository.remove(transactions);
  }
}

export default DeleteTransactionService;
