import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 5, b: 2, action: Action.Multiply, expected: 10 },
  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 3, b: 3, action: 'wow', expected: null },
  { a: 'string', b: 3, action: Action.Divide, expected: null },
];

describe('simpleCalculator', () => {
  it.each(testCases)('Test table', ({ a, b, action, expected }) => {
    expect(simpleCalculator({ a, b, action })).toBe(expected);
  });
});
