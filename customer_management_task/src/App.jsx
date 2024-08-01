import React, { useEffect, useState } from 'react'
import CustomerForm from './components/CustomerForm/CustomerForm'
import CustomerList from './components/CustomerList/CustomerList'
import '../src/App.css';
import '../src/index.css'; 
const App=()=> {

  const getCustomersFromStorage = () => {
    const storedCustomers = localStorage.getItem('customers');
    try {
      return storedCustomers ? JSON.parse(storedCustomers) : [];
    } catch (e) {
      console.error("Failed to parse customers from localStorage", e);
      return [];
    }
  };
  const [customers, setCustomers] = useState(getCustomersFromStorage());
   const [editingCustomer,setEditingCustomer] = useState(null);

   useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

   const handleAddCustomer=(newCustomer)=>{
       setCustomers([...customers, newCustomer]);
   };

   const handleEditCustomer=(updatedCustomer)=>{
        setCustomers(customers.map((customer)=>{customer.id===updatedCustomer.id?updatedCustomer:customer}));
        setEditingCustomer(null);
   };

   const handleDeleteCustomer=(customerId)=>{
      setCustomers(customers.filter(customer=>customer.id!=customerId));
   }


  return (
    <div class="main-container">
      <CustomerForm 
      onAddCustomer={handleAddCustomer} 
      onEditCustomer={handleEditCustomer} 
      editingCustomer={editingCustomer}/>

      <CustomerList  
      customers={customers} 
      onEditCustomer={setEditingCustomer} 
      onDeleteCustomer={handleDeleteCustomer}/>
    </div>
  );
};

export default App
