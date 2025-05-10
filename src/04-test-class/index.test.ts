import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  let newAccount: BankAccount;

  beforeEach(() => {
    newAccount = getBankAccount(300);
    newAccount.fetchBalance = jest.fn().mockResolvedValue(89);
  });
  test('should create account with initial balance', () => {
    expect(newAccount.getBalance()).toBe(300);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdraw = () => {
      newAccount.withdraw(350);
    };

    expect(withdraw).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const secondAccount = getBankAccount(350);
    const transfer = () => {
      newAccount.transfer(350, secondAccount);
    };
    expect(transfer).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const transfer = () => {
      newAccount.transfer(350, newAccount);
    };
    expect(transfer).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    newAccount.deposit(250);
    expect(newAccount.getBalance()).toBe(550);
  });

  test('should withdraw money', () => {
    newAccount.withdraw(250);

    expect(newAccount.getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const secondAccount = getBankAccount(0);
    newAccount.transfer(250, secondAccount);

    expect(secondAccount.getBalance()).toBe(250);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    await expect(newAccount.fetchBalance()).resolves.toBe(89);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    await newAccount.synchronizeBalance();
    expect(newAccount.getBalance()).toBe(89);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    newAccount.fetchBalance = jest.fn().mockResolvedValue(null);
    const syncho = () => {
      return newAccount.synchronizeBalance();
    };
    expect(syncho).rejects.toThrow(SynchronizationFailedError);
  });
});
