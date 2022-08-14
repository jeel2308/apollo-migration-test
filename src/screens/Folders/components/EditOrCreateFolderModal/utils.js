import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';

export const formFields = [
  {
    id: 'folder',
    label: 'Folder name',
    type: 'text',
    defaultValue: '',
    placeholder: 'folder',
    constrains: {
      required: true,
    },
    errorMessages: {
      required: 'Name is required!!',
    },
  },
];

export const getDynamicFormFields = ({ formFields, data }) => {
  if (_isEmpty(data)) {
    return formFields;
  }

  return _map(formFields, (field) => {
    const { id, ...rest } = field;
    switch (id) {
      case 'folder': {
        const defaultValue = data.name;
        return { id, ...rest, defaultValue };
      }
      default: {
        return { id, ...rest };
      }
    }
  });
};
