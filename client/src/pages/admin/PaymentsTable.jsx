import React, { useState } from 'react';

export const PaymentsTable = ({ payments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = payments?.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Payment Transactions</h2>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {/* <th>Transaction ID</th> */}
                <th>User</th>
                <th>Trainer</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Admin Revenue</th>
                <th>Trainer Revenue</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment) => (
                <tr key={payment.transactionId}>
                  {/* <td title={payment.transactionId}></td> */}
  {/* {payment?.transactionId?.slice(0, 6) + "..." + payment?.transactionId?.slice(-4)} */}

                  <td>{payment.userId ? payment.userId.name : 'N/A'}</td>
                  <td>{payment.trainerId ? payment.trainerId.name : 'N/A'}</td>

                  <td>{payment.plan}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{formatCurrency(payment.adminRevenue)}</td>
                  <td>{formatCurrency(payment.trainerRevenue)}</td>
                  <td>{formatDate(payment.date)}</td>
                  <td>
                    <span 
                      className={`badge ${
                        payment.status === 'Completed' 
                          ? 'badge-success' 
                          : payment.status === 'Pending'
                          ? 'badge-warning'
                          : 'badge-error'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, payments.length)} of {payments.length} entries
          </div>
          <div className="btn-group ">
            <button 
              className="btn btn-sm mr-2"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              className="btn btn-sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};