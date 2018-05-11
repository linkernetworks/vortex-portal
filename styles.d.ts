interface Stringifyable {
  /**
   * Stringifies the imported stylesheet for use with inline style tags
   */
  toString(): string;
}
interface SelectorNode {
  /**
   * Returns the specific selector from imported stylesheet as string
   */
  [key: string]: string;
}

declare module '*.css' {
  const styles: SelectorNode & Stringifyable;
  export = styles;
}

declare module '*.scss' {
  const styles: {[className: string]: string}
  export = styles;
}

declare module '*.sass' {
  const styles: SelectorNode & Stringifyable;
  export = styles;
}

declare module '*.less' {
  const styles: SelectorNode & Stringifyable;
  export = styles;
}
