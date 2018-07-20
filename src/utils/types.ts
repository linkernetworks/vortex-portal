export type SetIntersection<A, B> = A extends B ? A : never;

export type SetDifference<A, B> = A extends B ? never : A;

export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;

export type Diff<T extends object, U extends object> = Pick<
  T,
  SetDifference<keyof T, keyof U>
>;

export type Omit<T, K extends keyof T> = T extends any
  ? Pick<T, SetComplement<keyof T, K>>
  : never;
