import React, { useEffect, useState } from 'react';
import '../CustomerForm/customerform.css';
const CustomerForm = ({ onAddCustomer, onEditCustomer, editingCustomer }) => {
  const [formState, setFormState] = useState({
    pan: "",
    fullName: "",
    email: "",
    mobile: "",
    addresses: [{ addressLine1: "", addressLine2: "", postcode: "", state: "", city: "" }]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCustomer) {
      setFormState(editingCustomer);
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const addresses = [...formState.addresses];
    addresses[index][name] = value;
    setFormState({ ...formState, addresses });
  };

  const addAddress = () => {
    if (formState.addresses.length < 10) {
      setFormState({ ...formState, addresses: [...formState.addresses, { addressLine1: '', addressLine2: '', postcode: '', state: '', city: '' }] });
    } else {
      alert("You can add up to 10 addresses only.");
    }
  };

  const validateForm = () => {
    const { pan, fullName, email, mobile, addresses } = formState;
    const newErrors = {};

    if (!pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      newErrors.pan = "PAN must be in a valid format (e.g., AAAAA9999A).";
    }
    if (!fullName || fullName.length > 140) {
      newErrors.fullName = "Full Name is required and must be less than 140 characters.";
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || email.length > 255) {
      newErrors.email = "Email must be in a valid format and less than 255 characters.";
    }
    if (!mobile.match(/^\d{10}$/)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits.";
    }

    addresses.forEach((address, index) => {
      if (!address.addressLine1) {
        newErrors[`addressLine1_${index}`] = "Address Line 1 is required.";
      }
      if (!address.postcode.match(/^\d{6}$/)) {
        newErrors[`postcode_${index}`] = "Postcode must be exactly 6 digits.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (editingCustomer) {
      onEditCustomer({ ...formState, id: editingCustomer.id });
    } else {
      onAddCustomer({ ...formState, id: Date.now() });
    }

    setFormState({
      pan: "",
      fullName: "",
      email: "",
      mobile: "",
      addresses: [{ addressLine1: "", addressLine2: "", postcode: "", state: "", city: "" }]
    });
    setErrors({});
  };

  const verifyPan = async (pan) => {
    const response = await fetch('https://lab.pixel6.co/api/verify-pan.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ panNumber: pan })
    });
    const data = await response.json();
    if (data.isValid) {
      setFormState({ ...formState, fullName: data.fullName });
    } else {
      setErrors({ ...errors, pan: "Invalid PAN" });
    }
  };

  const getPostcodeDetails = async (postcode, index) => {
    const response = await fetch('https://lab.pixel6.co/api/get-postcode-details.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postcode })
    });
    const data = await response.json();
    if (data.status === "Success") {
      const addresses = [...formState.addresses];
      addresses[index].state = data.state[0].name;
      addresses[index].city = data.city[0].name;
      setFormState({ ...formState, addresses });
    } else {
      setErrors({ ...errors, [`postcode_${index}`]: "Invalid Postcode" });
    }
  };

  const handlePanChange = (e) => {
    handleChange(e);
    if (e.target.value.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      verifyPan(e.target.value);
    }
  };

  const handlePostcodeChange = (index, e) => {
    handleAddressChange(index, e);
    if (e.target.value.match(/^\d{6}$/)) {
      getPostcodeDetails(e.target.value, index);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>CUSTOMER FORM</h2>
      <input name='pan' value={formState.pan} onChange={handlePanChange} placeholder='PAN' required />
      {errors.pan && <div className="error">{errors.pan}</div>}

      <input name="fullName" value={formState.fullName} onChange={handleChange} placeholder='Full Name' required />
      {errors.fullName && <div className="error">{errors.fullName}</div>}

      <input name='email' value={formState.email} onChange={handleChange} placeholder='Email' required />
      {errors.email && <div className="error">{errors.email}</div>}

      <input name='mobile' value={formState.mobile} onChange={handleChange} placeholder='Mobile No.' required />
      {errors.mobile && <div className="error">{errors.mobile}</div>}

      {formState.addresses.map((address, index) => (
        <div className='Address' key={index}>
          <input name='addressLine1' value={address.addressLine1} onChange={(e) => handleAddressChange(index, e)} placeholder='Address Line 1' required />
          {errors[`addressLine1_${index}`] && <div className="error">{errors[`addressLine1_${index}`]}</div>}

          <input name='addressLine2' value={address.addressLine2} onChange={(e) => handleAddressChange(index, e)} placeholder='Address Line 2' />

          <input name='postcode' value={address.postcode} onChange={(e) => handlePostcodeChange(index, e)} placeholder='Postal Code' required />
          {errors[`postcode_${index}`] && <div className="error">{errors[`postcode_${index}`]}</div>}

          <input name='state' value={address.state} onChange={(e) => handleAddressChange(index, e)} placeholder='State' readOnly />

          <input name='city' value={address.city} onChange={(e) => handleAddressChange(index, e)} placeholder='City' readOnly />
        </div>
      ))}
      <button type="button" onClick={addAddress}>Add Address</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CustomerForm;
