import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Requeste {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Requeste): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    let transactionsCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });
    if (!transactionsCategory) {
      // Não existe ? crio ela
      transactionsCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionsCategory);
    }

    const transactions = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionsCategory,
    });

    await transactionsRepository.save(transactions);

    return transactions;
  }
}

export default CreateTransactionService;
