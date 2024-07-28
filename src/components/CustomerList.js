import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCustomer } from '../redux/actions';
import { Link } from 'react-router-dom';

const CustomerList = () => {
  const { customers } = useSelector((state) => state.customers);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteCustomer(id));
  };

  return (
    <div className='container mt-4'>
      <h3 className='text-center'><u>Customer List</u></h3>
      <Link to="/add">
        <button className='btn btn-primary mb-3'>Add Customer</button>
      </Link>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>PAN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>{customer.fullName}</td>
                <td>{customer.email}</td>
                <td>{customer.mobile}</td>
                <td>{customer.pan}</td>
                <td>
                  <Link to={`/edit/${customer.id}`} className='btn btn-info btn-sm me-2'>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className='btn btn-danger btn-sm'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className='text-center'>No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
