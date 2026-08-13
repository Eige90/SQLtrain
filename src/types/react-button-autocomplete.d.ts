import "react";

declare module "react" {
  // React's button attributes need the generic type parameter
  // for declaration merging, even though this augmentation
  // does not use it directly.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> {
    autoComplete?: string;
  }
}

export {};
