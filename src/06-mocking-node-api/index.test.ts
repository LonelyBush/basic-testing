import path from 'path';
import fs from 'fs';
import fs_promise from 'fs/promises';
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';

describe('doStuffByTimeout', () => {
  let mockTimeout: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    mockTimeout = jest.spyOn(global, 'setTimeout');
  });
  afterEach(() => {
    mockTimeout.mockRestore();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 300);
    expect(mockTimeout).toHaveBeenCalledWith(expect.any(Function), 300);
    jest.runAllTimers();
    expect(callback).toHaveBeenCalled();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 300);
    expect(callback).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let mockInterval: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    mockInterval = jest.spyOn(global, 'setInterval');
  });
  afterEach(() => {
    mockInterval.mockRestore();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 300);
    expect(mockInterval).toHaveBeenLastCalledWith(callback, 300);
    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 300;

    doStuffByInterval(callback, interval);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(interval * 2);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  let mockedJoin: jest.SpyInstance;
  let mockedExists: jest.SpyInstance;
  let mockedPromise: jest.SpyInstance;

  beforeEach(() => {
    mockedJoin = jest.spyOn(path, 'join');
    mockedExists = jest.spyOn(fs, 'existsSync');
    mockedPromise = jest.spyOn(fs_promise, 'readFile');
  });

  afterEach(() => {
    mockedPromise.mockRestore();
    mockedExists.mockRestore();
    mockedJoin.mockRestore();
  });

  test('should call join with pathToFile', async () => {
    mockedJoin.mockImplementation((...args: string[]) => args.join('/'));
    const testPath = 'src/path/cool.txt';
    await readFileAsynchronously(testPath);

    expect(mockedJoin).toHaveBeenCalledWith(
      expect.stringContaining(__dirname),
      testPath,
    );
  });

  test('should return null if file does not exist', async () => {
    const wrongPath = 'wrong/path/text.txt';
    const coolData = await readFileAsynchronously(wrongPath);

    mockedExists.mockReturnValue(false);

    expect(coolData).toBe(null);
  });

  test('should return file content if file exists', async () => {
    const successPath = 'fullPath/wow/cool.txt';
    mockedExists.mockReturnValue(true);
    mockedPromise.mockResolvedValue('content data wow!');

    const coolData = await readFileAsynchronously(successPath);

    expect(coolData).toBe('content data wow!');
  });
});
