import { validateEmail } from '#Utils';

const formFields = [
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
];

export { formFields };
