export const ADD_CUSTOMER = 'ADD_CUSTOMER';
export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';

export const addCustomer = (customer) => ({
  type: ADD_CUSTOMER,
  payload: customer,
});

export const updateCustomer = (customer) => ({
  type: UPDATE_CUSTOMER,
  payload: customer,
});

export const deleteCustomer = (id) => ({
  type: DELETE_CUSTOMER,
  payload: id,
});
