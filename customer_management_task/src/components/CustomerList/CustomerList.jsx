import React from 'react';
import '../CustomerList/customerlist.css';
const CustomerList = ({ customers, onEditCustomer, onDeleteCustomer }) => {
  return (
    <div class="customer-list">
      <h2>CUSTOMER LIST</h2>
      {customers.map(customer => (
        <div class="customer" key={customer.id}>
          <p><span>Full Name: </span>{customer.fullName}</p>
          <p><span>PAN: </span>{customer.pan}</p>
          <p><span>Email: </span>{customer.email}</p>
          <p><span>Mobile: </span>{customer.mobile}</p>
          {customer.addresses.map((address, index) => (
            <div key={index}>
              <p><span>Address Line 1: </span>{address.addressLine1}</p>
              <p><span>Address Line 2: </span>{address.addressLine2}</p>
              <p><span>Postcode: </span>{address.postcode}</p>
              <p><span>State:</span> {address.state}</p>
              <p><span>City:</span> {address.city}</p>
            </div>
          ))}
          <button onClick={() => onEditCustomer(customer)}>Edit</button>
          <button onClick={() => onDeleteCustomer(customer.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default CustomerList;
