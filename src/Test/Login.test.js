import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
//import Login from '../components/Login'
import App from '../App'
import TestRenderer from 'react-test-renderer';
describe('Login tests', () => {

  it('should contains button with button toBeEnabled', () => {
    render(<App />);
      userEvent.type(screen.getByRole("textbox", {id: "email"}), "abc@email.com");
      userEvent.type(screen.getByRole("textbox", {id: "password"}), "abc@email.com");
      const button = screen.getByRole("button", {name: "log In"});
      expect(button).toBeEnabled()
  });

  it('test to match snapshot of component', () => {
      const loginTree = TestRenderer.create(<App/>).toJSON()
      expect(loginTree).toMatchSnapshot();
    });
});