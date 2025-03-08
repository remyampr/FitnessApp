import React from 'react'

export const AlertError = ({error}) => {
  return (
    <div className="p-4">
        <div className="alert alert-error">{error}</div>
      </div>
  )
}
