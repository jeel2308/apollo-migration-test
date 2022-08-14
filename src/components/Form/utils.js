import _keys from 'lodash/keys';
import _map from 'lodash/map';
import _reduce from 'lodash/reduce';

export const getInitialValues = ({ fields }) => {
  return fields.reduce((result, { defaultValue, id }) => {
    return { ...result, [id]: defaultValue };
  }, {});
};

export const trimFormFields = (formData) => {
  const keys = _keys(formData);
  return _reduce(
    keys,
    (result, key) => {
      const oldValue = formData[key];
      let updatedValue = oldValue;
      if (oldValue.trim) {
        updatedValue = oldValue.trim();
      }

      return { ...result, [key]: updatedValue };
    },
    {}
  );
};
