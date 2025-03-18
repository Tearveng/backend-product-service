export const pick = <T, K extends keyof T>(obj: T, ...props: Array<K>) => {
  return props.reduce((result, prop) => {
    result[prop] = obj[prop];
    return result;
  }, {} as T);
};

/** omit properties from an object */
export const omit = <T, K extends keyof T>(obj: T, ...props: Array<K>) => {
  const result = { ...obj };
  props.forEach((prop) => {
    delete result[prop];
  });

  return result as Omit<T, K>;
};
