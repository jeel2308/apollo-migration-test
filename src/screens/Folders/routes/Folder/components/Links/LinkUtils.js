import _filter from 'lodash/filter';
import _reduce from 'lodash/reduce';

export const LINK_ACTIONS = [
  { label: 'Edit', value: 'EDIT' },
  { label: 'Delete', value: 'DELETE' },
  {
    label: 'Mark as complete',
    value: 'MARK_AS_COMPLETE',
    getVisibilityStatus: ({ isCompleted }) => !isCompleted,
  },
  {
    label: 'Mark as pending',
    value: 'MARK_AS_PENDING',
    getVisibilityStatus: ({ isCompleted }) => isCompleted,
  },
  {
    label: 'Select',
    value: 'SELECT',
  },
  {
    label: 'Move',
    value: 'MOVE',
    getVisibilityStatus: ({ showMoveAction }) => showMoveAction,
  },
  {
    label: 'Copy url',
    value: 'COPY',
  },
];

export const BULK_LINK_ACTIONS = [
  {
    value: 'CANCEL',
    variant: 'unstyled',
    label: 'Cancel',
    style: { marginRight: 'auto' },
  },
  {
    value: 'UPDATE_STATUS',
    colorScheme: 'blue',
    getDisabilityStatus: ({ totalLinks }) => !totalLinks,
    getLabel: ({ isCompleted }) =>
      isCompleted ? 'Mark as pending' : 'Mark as completed',
  },
  {
    value: 'MOVE',
    colorScheme: 'blue',
    label: 'Move',
    getVisibilityStatus: ({ showMoveAction }) => showMoveAction,
    getDisabilityStatus: ({ totalLinks }) => !totalLinks,
  },
  {
    value: 'DELETE',
    colorScheme: 'red',
    label: 'Delete',
    getDisabilityStatus: ({ totalLinks }) => !totalLinks,
  },
];

export const DELETE_LINK_OPERATION = 'DELETE_LINK_OPERATION';

export const getLinkActions = (data) => {
  return _filter(LINK_ACTIONS, (link) => {
    const { getVisibilityStatus } = link;
    return getVisibilityStatus?.(data) ?? true;
  });
};

export const getBulkLinkActions = (data) => {
  return _reduce(
    BULK_LINK_ACTIONS,
    (result, bulkLinkAction) => {
      const {
        getVisibilityStatus,
        label: defaultLabel,
        getLabel,
        getDisabilityStatus,
      } = bulkLinkAction;

      const isActionVisible = getVisibilityStatus?.(data) ?? true;

      if (isActionVisible) {
        const disabled = getDisabilityStatus?.(data) ?? false;

        const label = getLabel?.(data) ?? defaultLabel;

        const updatedBulkAction = { ...bulkLinkAction, disabled, label };

        return [...result, updatedBulkAction];
      }

      return result;
    },
    []
  );
};
