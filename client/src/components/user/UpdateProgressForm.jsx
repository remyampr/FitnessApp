import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const UpdateProgressForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProgress(formData));
    setFormData({ weight: '', bodyFat: '', notes: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Weight (kg)</span>
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="input input-bordered"
            step="0.1"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Body Fat (%)</span>
          </label>
          <input
            type="number"
            name="bodyFat"
            value={formData.bodyFat}
            onChange={handleChange}
            className="input input-bordered"
            step="0.1"
          />
        </div>
      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Notes</span>
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="textarea textarea-bordered h-24"
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">Save Progress</button>
    </form>
  );
};

