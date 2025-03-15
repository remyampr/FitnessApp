import React, { useState, useEffect } from "react";
import { FiX, FiSave } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../services/adminServices";
import { updateUserInStore } from "../../redux/features/adminSlice";

export const UserModal = ({ user, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { trainers } = useSelector((state) => state.admin);

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({ ...user });
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { trainerId, status } = userData;
      const updatedData = { trainerId, status };

      const res = await updateUser(userData._id, userData);
      // console.log("response after updating user : ", res.data.user);

      if (res && res.data.user) {
        dispatch(updateUserInStore(res.data.user));
        // console.log("state update", user);
      }

      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">User Details</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle">
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info Section */}
            <div>
              <h4 className="font-semibold mb-3">Basic Information</h4>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name || ""}
                    className="input input-bordered w-full"
                    readOnly
                  />
                </div>

                <div className="form-control">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email || ""}
                    className="input input-bordered w-full"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Fitness Details Section */}
            <div>
              <h4 className="font-semibold mb-3">Fitness Details</h4>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">Fitness Goal</label>
                  <input
                    type="text"
                    value={userData.fitnessGoal || ""}
                    className="input input-bordered w-full"
                    readOnly
                  />
                </div>

                <div className="form-control">
                  <label className="label">Assigned Trainer</label>
                  <select
                    name="trainerId"
                    value={userData.trainerId || ""}
                    onChange={(e) => {
                      const trainerId = e.target.value;
                      setUserData((prev) => ({
                        ...prev,
                        trainerId,
                      }));
                    }}
                    className="select select-bordered w-full"
                  >
                    <option value="">{user.trainerId?.name || 'No trainer assigned'}</option>
                    {trainers.map((trainer) => (
                      <option key={trainer._id} value={trainer._id}>
                        {trainer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">Member Since</label>
                  <input
                    type="text"
                    value={
                      userData.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString()
                        : ""
                    }
                    className="input input-bordered w-full"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Additional Information</h4>
            <div className="form-control">
              <label className="label">Notes</label>
              <textarea
                name="notes"
                value={userData.notes || ""}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-24"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center p-4 border-t">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary ml-2"
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
    </div>
  );
};
