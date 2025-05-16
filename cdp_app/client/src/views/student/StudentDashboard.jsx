import React from 'react';
import { BsCreditCard2Front, BsCalendar2Date } from 'react-icons/bs';

const StudentDashboard = () => {
  const payments = [
    {
      id: "INV-2025-01",
      amount: 1200,
      status: "Paid",
      due: "2025-01-05",
      paid: "2025-01-05",
    },
    {
      id: "INV-2025-02",
      amount: 1200,
      status: "Paid",
      due: "2025-02-05",
      paid: "2025-02-04",
    },
    {
      id: "INV-2025-03",
      amount: 1200,
      status: "Paid",
      due: "2025-03-05",
      paid: "2025-03-03",
    },
  ];

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const nextPayment = { amount: 1200, due: "2025-04-05", daysLeft: 16 };

  const paymentData = {
    totalPaid: 4800,
    nextPayment: "2025-04-05",
    lastPayment: "2025-06-05",
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 rounded-full p-3 mr-3">
              <BsCreditCard2Front className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-0">Total Paid</p>
              <h3 className="text-xl font-bold">${paymentData.totalPaid}</h3>
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            For the current academic year
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-3">
            <div className="bg-green-100 rounded-full p-3 mr-3">
              <BsCalendar2Date className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-0">Next Payment</p>
              <h3 className="text-xl font-bold">April 5, 2025</h3>
            </div>
          </div>
          <p className="text-gray-500 text-xs">Due in 16 days</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-3">
            <div className="bg-red-100 rounded-full p-3 mr-3">
              <BsCalendar2Date className="text-red-500" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-0">Last Payment</p>
              <h3 className="text-xl font-bold">Jun 5, 2025</h3>
            </div>
          </div>
          <p className="text-gray-500 text-xs">Completed</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mt-6 p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">Upcoming Payment</h2>
          <p>
            Your next payment of <strong>${nextPayment.amount}</strong> is due
            on <strong>{nextPayment.due}</strong>.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2 mb-2">
            <div 
              className="bg-blue-500 h-4 rounded-full" 
              style={{ width: `${100 - (nextPayment.daysLeft / 30) * 100}%` }}
            ></div>
          </div>
          <p className="text-gray-500 text-sm">{nextPayment.daysLeft} days left</p>
          <p className="text-red-500 text-xs mt-2">
            If there is an error please consider contacting the administration
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mt-6 p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Payment History</h2>
          <div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm mr-2">
              This Year
            </button>
            <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded text-sm">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((p, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${p.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.due}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.paid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">View Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;