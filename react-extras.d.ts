import { HTMLAttributes } from 'react';

declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    fetchPriority?: 'auto' | 'low' | 'high';
  }
}
