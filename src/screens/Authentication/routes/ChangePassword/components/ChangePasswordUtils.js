const formFields = [
  {
    id: 'password',
    label: 'New password',
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

export { formFields };
