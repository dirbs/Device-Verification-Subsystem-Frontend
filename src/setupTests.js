import sinon from 'sinon';
import Enzyme from 'enzyme';
import {shallow, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import react from 'react';

Enzyme.configure({adapter: new Adapter() });

global.React = react;
global.Sinon = sinon;
global.shallow = shallow;
global.mount = mount;
global.render = render;