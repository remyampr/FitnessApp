import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { deactivateTrainer, updateTrainer } from "../../services/adminServices";
import { deleteTrainerFromStore, updateTrainerInStore } from "../../redux/features/adminSlice";


export const TrainerModal = ({ trainer, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [trainerData, setTrainerData] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trainer) {
      setTrainerData({ ...trainer });
    }
  }, [trainer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    console.log();
    ("save")
    setLoading(true);
    try {
      const { isApproved, notes } = trainerData;
      const updatedData = { isApproved, notes };

      console.log("trainer to update : ",trainerData._id, updatedData)

      const res = await updateTrainer(trainerData._id, updatedData);

      console.log("res after updating : ",res);
      

      if (res && res.data.trainer) {
        dispatch(updateTrainerInStore(res.data.trainer));
      }

      onClose();
    } catch (error) {
      console.error("Failed to update trainer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      const res = await deactivateTrainer(trainerData._id);

      if (res.status === 200) {
        dispatch(deleteTrainerFromStore(trainerData._id));
      }
      onClose();
    } catch (error) {
      console.error("Failed to delete trainer:", error);
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-4xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">Trainer Details</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle">
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isDeleting ? (
            <div className="p-6 text-center">
              <FiAlertTriangle className="mx-auto text-warning text-5xl mb-4" />
              <h3 className="text-lg font-bold mb-2">
                Are you sure you want to suspend this trainer?
              </h3>
           
              <div className="flex justify-center space-x-4">
                <button
                  className="btn btn-error"
                  onClick={handleDeactivate}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Yes, Suspend Trainer"
                  )}
                </button>
                <button
                  className="btn"
                  onClick={() => setIsDeleting(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Image */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="avatar mb-4">
                  <div className="w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img 
                      src={trainerData.image || "/default-avatar.png"} 
                      alt={`${trainerData.name}'s profile`} 
                    />
                  </div>
                </div>
                <h2 className="text-xl font-bold">{trainerData.name}</h2>
              </div>

              {/* Trainer Details */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <div className="form-control">
                    <label className="label">Name</label>
                    <input
                      type="text"
                      value={trainerData.name || ""}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Email</label>
                    <input
                      type="email"
                      value={trainerData.email || ""}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Phone</label>
                    <input
                      type="text"
                      value={trainerData.phone || ""}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Approval Status</label>
                    <select
                      name="isApproved"
                      value={trainerData.isApproved || false}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value={false}>Not Approved</option>
                      <option value={true}>Approved</option>
                    </select>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="form-control">
                    <label className="label">Specialization</label>
                    <input
                      type="text"
                      value={trainerData.specialization || ""}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Experience (Years)</label>
                    <input
                      type="text"
                      value={trainerData.experience || ""}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Availability</label>
                    <input
                      type="text"
                      value={trainerData.availability || ""}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Certifications</label>
                    <input
                      type="text"
                      value={trainerData.certifications || ""}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="form-control mt-4">
                  <label className="label">Social Links</label>
                  <div className="grid grid-cols-2 gap-4">
                    {trainerData.socialLinks?.map((link, index) => (
                      <div key={index} className="form-control">
                        <input
                          type="text"
                          value={link}
                          className="input input-bordered w-full"
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="form-control mt-4">
                  <label className="label">Admin Notes</label>
                  <textarea
                    name="notes"
                    value={trainerData.notes || ""}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full h-24"
                    placeholder="Additional notes or comments"
                  ></textarea>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!isDeleting && (
          <div className="flex justify-between items-center p-4 border-t">
            <button
              onClick={() => setIsDeleting(true)}
              className="btn btn-outline btn-error"
            >
              <FiTrash2 className="mr-2" /> Suspend Trainer
            </button>
            <div className="space-x-2">
              <button onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <FiSave className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};