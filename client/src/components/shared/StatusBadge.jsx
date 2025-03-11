import React from 'react'


export const StatusBadge = ({ status }) => {
  let badgeClass = 'badge ';
  
  switch (status) {
    case 'Pending':
      badgeClass += 'badge-warning';
      break;
    case 'Confirmed':
      badgeClass += 'badge-primary';
      break;
    case 'Completed':
      badgeClass += 'badge-success';
      break;
    case 'Cancelled':
      badgeClass += 'badge-error';
      break;
    default:
      badgeClass += 'badge-ghost';
  }
  
  return <span className={badgeClass}>{status}</span>;
};