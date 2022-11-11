import { AriaAttributes } from 'react';

declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    fetchpriority?: 'auto' | 'low' | 'high';
  }
}
