import { chunk } from '../chunk';

describe('chunk', () => {
  it('splits a list into pieces of the given size, keeping the remainder', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns no pieces for an empty list', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it('rejects a size that is not a positive integer', () => {
    expect(() => chunk([1], 0)).toThrow('positive integer');
  });
});
