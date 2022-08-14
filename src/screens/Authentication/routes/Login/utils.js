import { validateEmail } from '#Utils';

export const formFields = [
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    defaultValue: '',
    placeholder: 'something@gmail.com',
    errorMessages: {
      required: 'Email is required!!',
      validate: 'Invalid email!!',
    },
    constrains: {
      required: true,
      validate: validateEmail,
    },
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    defaultValue: '',
    placeholder: 'Password',
    constrains: {
      required: true,
    },
    errorMessages: {
      required: 'Password is required!!',
    },
  },
];
