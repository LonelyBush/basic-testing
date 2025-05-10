import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const elements = [1];
    const expected = {
      value: 1,
      next: {
        value: null,
        next: null,
      },
    };

    const result = generateLinkedList(elements);
    expect(result).toStrictEqual(expected);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const elements = [1, 2, 3];
    const result = generateLinkedList(elements);
    expect(result).toMatchSnapshot();
  });
});
