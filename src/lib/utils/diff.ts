function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function safeParse<T extends object>(obj: T | string): T {
  if (typeof obj === 'string') {
    try {
      return JSON.parse(obj);
    } catch {
      throw new Error('Invalid JSON passed to diff()');
    }
  }
  return obj;
}

export default function diff<
  A extends object,
  B extends object
>(oldObjRaw: A | string, newObjRaw: B | string): Partial<B> {
  const oldObj = safeParse(oldObjRaw);
  const newObj = safeParse(newObjRaw);
  const changes: Partial<B> = {};

  for (const key of Object.keys(newObj)) {
    const a = (oldObj as any)[key];
    const b = (newObj as any)[key];

    if (isObject(a) && isObject(b)) {
      const nested = diff(a, b);
      if (Object.keys(nested).length > 0) {
        (changes as any)[key] = nested;
      }
    } else if (a !== b) {
      (changes as any)[key] = b;
    }
  }

  return changes;
}
