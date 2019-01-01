import React from 'react';
import {shallow, mount} from 'enzyme';
import Header from "./Header";
const userDetails = {
  preferred_username: "User"
}
describe('Header component',()=>{
  /**
   * Test if header renders successfully
   */
  test('If header renders',()=>{
    const wrapper = shallow(<Header/>);
    expect(wrapper.exists()).toBe(true);
  })
  /**
   * Test if header consists of class
   */
  test('If header has class',()=>{
    const wrapper = shallow(<Header/>);
    expect(wrapper.find('.app-header').length).toEqual(1)
  })
})