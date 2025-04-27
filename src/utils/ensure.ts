const getError = <E extends Error = Error>(
  error?: string | ((msg: string) => E),
) => {
  if (typeof error === 'string') {
    return new Error(error);
  } else {
    const handler = error || ((msg: string) => new Error(msg));
    return handler('Value is null or undefined');
  }
};

export const ensureComparision = <T, E extends Error = Error>(
  value: T,
  compare: (value: T) => boolean,
  error?: string | ((msg: string) => E),
): T => {
  if (!compare(value)) {
    throw getError(error);
  }
  return value;
};

export const ensure = <T, E extends Error = Error>(
  value: T,
  error: string | ((msg: string) => E),
): NonNullable<T> => {
  return ensureComparision(
    value,
    (value) => value !== null && value !== undefined,
    error,
  )!;
};
