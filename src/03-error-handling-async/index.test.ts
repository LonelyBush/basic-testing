import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const data = await resolveValue(234);

    expect(data).toBe(234);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const throwTest = () => {
      throwError('Wow error');
    };
    expect(throwTest).toThrow('Wow error');
  });

  test('should throw error with default message if message is not provided', () => {
    const throwTest = () => {
      throwError();
    };
    expect(throwTest).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const throwTest = () => {
      throwCustomError();
    };

    expect(throwTest).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const throwTest = () => {
      return rejectCustomError();
    };

    await expect(throwTest).rejects.toThrow(MyAwesomeError);
  });
});
