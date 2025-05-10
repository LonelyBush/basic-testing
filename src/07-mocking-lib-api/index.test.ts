import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  let mockedInstance: jest.Mocked<AxiosInstance>;
  beforeEach(() => {
    jest.clearAllMocks();
    mockedInstance = {
      get: jest.fn(),
    } as unknown as jest.Mocked<AxiosInstance>;

    mockedAxios.create.mockImplementation(() => mockedInstance);
  });

  test('should create instance with provided base url', async () => {
    const relativePath = '/test';

    mockedInstance.get.mockResolvedValue({ status: 200, data: 'test data' });
    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/posts/1';
    mockedInstance.get.mockResolvedValue({ status: 200, data: 'test data' });
    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create().get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const testData = { id: 1, title: 'test' };
    mockedInstance.get.mockResolvedValue({ status: 200, data: testData });

    const result = await throttledGetDataFromApi('/any-path');

    expect(result).toEqual(testData);
  });
});
