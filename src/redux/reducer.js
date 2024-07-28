import { ADD_CUSTOMER, UPDATE_CUSTOMER, DELETE_CUSTOMER } from './actions';

const initialState = {
  customers: [],
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CUSTOMER:
      return { ...state, customers: [...state.customers, action.payload] };
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? { ...customer, ...action.payload } : customer
        ),
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter((customer) => customer.id !== action.payload),
      };
    default:
      return state;
  }
};

export default customerReducer;
