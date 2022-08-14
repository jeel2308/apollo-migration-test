import { validateEmail } from '#Utils';

export const formFields = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    defaultValue: '',
    placeholder: 'Name',
    constrains: {
      minLength: 4,
      required: true,
    },
    errorMessages: {
      required: 'Name is required!!',
      minLength: 'Name should have at least 4 characters',
    },
  },
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
      minLength: 8,
      required: true,
    },
    errorMessages: {
      required: 'Password is required!!',
      minLength: 'Password should have at least 8 characters',
    },
  },
];
