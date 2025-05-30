// src/components/EmployeeProfile.tsx

'use client';

import React, { useState } from 'react';

// Sample employee data
type Employee = {
  name: string;
  email: string;
  department: string;
  role: string;
};

const sampleEmployee: Employee = {
  name: 'Shivanya Kumari',
  email: 'shivanya@company.com',
  department: 'IT Support',
  role: 'Employee',
};

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState<Employee>(sampleEmployee);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState<Employee>(employee);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setEmployee(updatedEmployee); // Save the updated employee data
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedEmployee({ ...updatedEmployee, [name]: value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      <div className="space-y-4">
        {/* Employee Profile Details */}
        <div className="space-y-2">
          <div>
            <strong>Name: </strong>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={updatedEmployee.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            ) : (
              <span>{employee.name}</span>
            )}
          </div>

          <div>
            <strong>Email: </strong>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={updatedEmployee.email}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            ) : (
              <span>{employee.email}</span>
            )}
          </div>

          <div>
            <strong>Department: </strong>
            {isEditing ? (
              <input
                type="text"
                name="department"
                value={updatedEmployee.department}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            ) : (
              <span>{employee.department}</span>
            )}
          </div>

          <div>
            <strong>Role: </strong>
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={updatedEmployee.role}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            ) : (
              <span>{employee.role}</span>
            )}
          </div>
        </div>

        {/* Edit/Save Button */}
        <div className="flex space-x-4 mt-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
