import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;

configure({
  adapter: new Adapter(),
});
