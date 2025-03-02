import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, updateUser } from "../../services/adminServices";
import { deleteUserFromStore, setUsers, updateUserInStore } from "../../redux/features/adminSlice";

export const UserModal = ({ user, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { trainers } = useSelector((state) => state.admin);

  const [userData, setUserData] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({ ...user });
    }
  }, [dispatch,user]);

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
      console.log("response after updating user : ",res.data.user);

      if(res && res.data.user){
        dispatch(updateUserInStore(res.data.user));
        console.log("state update",user);
        
      }
      

      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // await dispatch(deleteUser(userData._id));

      const res=await deleteUser(userData._id);

      if (res.status === 200) {
        dispatch(deleteUserFromStore(userData._id)); 
      }
      onClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setLoading(false);
      setIsDeleting(false);
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
          {isDeleting ? (
            <div className="p-6 text-center">
              <FiAlertTriangle className="mx-auto text-warning text-5xl mb-4" />
              <h3 className="text-lg font-bold mb-2">
                Are you sure you want to delete this user?
              </h3>
              <p className="text-gray-500 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  className="btn btn-error"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Yes, Delete User"
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
            <>
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

                    <div className="form-control">
                      <label className="label">Status</label>
                      <select
                        name="status"
                        value={userData.status || "active"}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
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
                        <option value="">{user.trainerId ?.name || 'No trainer assigned'}</option>
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
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!isDeleting && (
          <div className="flex justify-between items-center p-4 border-t">
            <button
              onClick={() => setIsDeleting(true)}
              className="btn btn-outline btn-error"
            >
              <FiTrash2 className="mr-2" /> Delete User
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
