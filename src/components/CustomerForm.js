import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, updateCustomer } from "../redux/actions";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CustomerForm = () => {
  const [customer, setCustomer] = useState({
    id: null,
    pan: "",
    fullName: "",
    email: "",
    mobile: "",
    addresses: [
      { addressLine1: "", addressLine2: "", postcode: "", state: "", city: "" },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [postcodeLoading, setPostcodeLoading] = useState(false);
  const [postcodeError, setPostcodeError] = useState("");
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const customers = useSelector((state) => state.customers.customers);

  useEffect(() => {
    if (id) {
      const customerToEdit = customers.find((customer) => customer.id === parseInt(id, 10));
      if (customerToEdit) {
        setCustomer(customerToEdit);
      }
    }
  }, [id, customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pan") {
      setCustomer((prev) => ({ ...prev, [name]: value }));
      if (value.length === 10 && validatePan(value)) {
        setError("");
        verifyPAN(value);
      } else {
        setError("Invalid PAN format.");
        setCustomer((prev) => ({ ...prev, fullName: "" }));
      }
    }

    if (name === 'mobile') {
      const numericValue = value.replace(/\D/g, ''); 
      setCustomer((prev) => ({ ...prev, [name]: numericValue.slice(0, 10) }));
    } else {
      setCustomer((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;

    if (name === "postcode") {
      const isNumeric = /^\d+$/.test(value);
      if (!isNumeric || value.length !== 6) {
        setPostcodeError("Invalid postcode. It should be a 6-digit number.");
        setCustomer((prev) => ({
          ...prev,
          addresses: prev.addresses.map((addr, i) => i === index ? { ...addr, postcode: value } : addr),
        }));
        return;
      } else {
        setPostcodeError("");
        getPostcodeDetails(value, index);
      }
    }

    setCustomer((prev) => {
      const updatedAddresses = prev.addresses.map((addr, i) => i === index ? { ...addr, [name]: value } : addr);
      return { ...prev, addresses: updatedAddresses };
    });
  };

  const addAddress = () => {
    setCustomer((prev) => ({
      ...prev,
      addresses: [...prev.addresses, { addressLine1: "", addressLine2: "", postcode: "", state: "", city: "" }],
    }));
  };

  const removeAddress = (index) => {
    setCustomer((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  };

  const verifyPAN = async (panNumber) => {
    setLoading(true);
    try {
      const response = await axios.post("https://lab.pixel6.co/api/verify-pan.php", { panNumber });
      if (response.data.status === "Success" && response.data.isValid) {
        setCustomer((prev) => ({ ...prev, fullName: response.data.fullName }));
      } else {
        setError("Failed to verify PAN or PAN is invalid.");
        setCustomer((prev) => ({ ...prev, fullName: "" }));
      }
    } catch {
      setError("Error verifying PAN.");
    } finally {
      setLoading(false);
    }
  };

  const getPostcodeDetails = async (postcode, index) => {
    setPostcodeLoading(true);
    try {
      const response = await axios.post("https://lab.pixel6.co/api/get-postcode-details.php", { postcode });
      if (response.data.status === "Success") {
        const { city, state } = response.data;
        setCustomer((prev) => {
          const updatedAddresses = prev.addresses.map((addr, i) => i === index ? { ...addr, city: city[0].name, state: state[0].name } : addr);
          return { ...prev, addresses: updatedAddresses };
        });
        setCities(city);
        setStates(state);
        setPostcodeError("");
      } else {
        setPostcodeError("Failed to get details for the postcode.");
      }
    } catch {
      setPostcodeError("Error fetching postcode details.");
    } finally {
      setPostcodeLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePan(customer.pan)) {
      if (customer.id) {
        dispatch(updateCustomer(customer));
      } else {
        dispatch(addCustomer({ ...customer, id: new Date().getTime() }));
      }
      navigate("/");
    } else {
      setError("Invalid PAN format.");
    }
  };

  const validatePan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-sm-5">
          <h3 className="text-center my-4"><u>Register Form</u></h3>
          <form onSubmit={handleSubmit}>
            <div className="mt-3">
              <label>PAN:</label>
              <input
                placeholder="Enter PAN Number"
                className="form-control mt-1"
                type="text"
                name="pan"
                value={customer.pan}
                onChange={handleChange}
                required
                maxLength="10"
              />
              {loading && <span>Loading...</span>}
              {error && <span style={{ color: "red" }}>{error}</span>}
            </div>

            <div className="mt-3">
              <label>Full Name:</label>
              <input
                placeholder="Enter Full Name"
                className="form-control mt-1"
                type="text"
                name="fullName"
                value={customer.fullName}
                onChange={handleChange}
                required
                maxLength="140"
              />
            </div>

            <div className="mt-3">
              <label>Email:</label>
              <input
                className="form-control mt-1"
                placeholder="Enter Email"
                type="email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                required
                maxLength="255"
              />
            </div>

            <div className="mt-3">
              <label>Mobile (+91):</label>
              <input
                className="form-control mt-1"
                type="tel"
                name="mobile"
                value={customer.mobile}
                onChange={handleChange}
                required
                maxLength="10" 
                pattern="\d{10}" 
                placeholder="Enter 10-digit mobile number"
                title="Please enter a 10-digit mobile number"
              />
            </div>  

            {customer.addresses.map((address, index) => (
              <div className="mt-3" key={index}>
                <h4>Address {index + 1}</h4>
                <div>
                  <label>Address Line 1:</label>
                  <input
                    className="form-control mt-1"
                    placeholder="Address Line 1"
                    type="text"
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={(e) => handleAddressChange(index, e)}
                    required
                  />
                </div>
                <div className="mt-3">
                  <label>Address Line 2:</label>
                  <input
                    className="form-control mt-1"
                    placeholder="Address Line 2"
                    type="text"
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </div>
                <div className="mt-3">
                  <label>Postcode:</label>
                  <input
                    className="form-control mt-1"
                    placeholder="Enter Postcode"
                    type="text"
                    name="postcode"
                    value={address.postcode}
                    onChange={(e) => handleAddressChange(index, e)}
                    required
                    maxLength="6"
                  />
                  {postcodeLoading && <span>Loading...</span>}
                  {postcodeError && <span style={{ color: "red" }}>{postcodeError}</span>}
                </div>
                <div className="mt-3">
                  <label>State:</label>
                  <select
                    className="form-control mt-1"
                    name="state"
                    value={address.state}
                    onChange={(e) => handleAddressChange(index, e)}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.name}>{state.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-3">
                  <label>City:</label>
                  <select
                    className="form-control mt-1"
                    name="city"
                    value={address.city}
                    onChange={(e) => handleAddressChange(index, e)}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-danger my-3"
                    onClick={() => removeAddress(index)}
                  >
                    Remove Address
                  </button>
                )}
              </div>
            ))}

            <button
              className="btn btn-primary my-3"
              type="button"
              onClick={addAddress}
              disabled={customer.addresses.length >= 10}
            >
              Add Address
            </button>
            <button className="btn btn-warning ms-2 my-3" type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;