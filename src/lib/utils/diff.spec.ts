import { describe, it, expect } from 'vitest';
import diff from './diff';

describe('utils/diff', () => {
  it('detects changed scalar fields', () => {
    const before = { title: 'A', desc: 'x' };
    const after  = { title: 'B', desc: 'x' };
    expect(diff(before, after)).toEqual({ title: 'B' });
  });
  
  it('works when input is a JSON string', () => {
    const before = '{"a":1,"b":2}';
    const after  = '{"a":2,"b":2}';
    expect(diff(before, after)).toEqual({ a: 2 });
  });

  it('throws on invalid JSON string', () => {
    expect(() => diff('{bad json}', '{"a":1}')).toThrow('Invalid JSON passed to diff()');
  });

  it('handles nested changed fields', () => {
    const before = { nest: { val: 1 }, x: 0 };
    const after  = { nest: { val: 2 }, x: 0 };
    expect(diff(before, after)).toEqual({ nest: { val: 2 } });
  });

  it('ignores unchanged nested fields', () => {
    const before = { nest: { val: 1 }, x: 0 };
    const after  = { nest: { val: 1 }, x: 0 };
    expect(diff(before, after)).toEqual({});
  });

  it('treats arrays as scalars (not objects)', () => {
    const before = { arr: [1, 2, 3] };
    const after  = { arr: [1, 2, 4] };
    expect(diff(before, after)).toEqual({ arr: [1, 2, 4] });
  });
});