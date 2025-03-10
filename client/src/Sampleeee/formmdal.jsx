<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="modal-box w-11/12 max-w-3xl bg-white p-6">
  <h3 className="font-bold text-lg mb-4">Book an Appointment</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block mb-2 font-medium">Select Date</label>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={getTileClassName}
        tileDisabled={tileDisabled}
        className="rounded-lg overflow-hidden"
      />
    </div>
    
    <div>
      <label className="block mb-2 font-medium">Available Time Slots</label>
      {availableTimeSlots.length === 0 ? (
        <p className="text-error">No available time slots for this date</p>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {availableTimeSlots.map((slot, index) => (
            <button
              key={index}
              className={`btn ${selectedTimeSlot === slot ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedTimeSlot(slot)}
            >
              {slot.startTime} - {slot.endTime}
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-4">
        <label className="block mb-2 font-medium">Appointment Type</label>
        <select 
          className="select select-bordered w-full"
          value={bookingType}
          onChange={(e) => setBookingType(e.target.value)}
        >
          <option value="">Select type</option>
          <option value="Consultation">Consultation</option>
          <option value="Training Session">Training Session</option>
          <option value="Progress Review">Progress Review</option>
          <option value="Diet Planning">Diet Planning</option>
        </select>
      </div>
      
      <div className="mt-4">
        <label className="block mb-2 font-medium">Notes (optional)</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific details about this appointment..."
        ></textarea>
      </div>
    </div>
  </div>
  
  <div className="modal-action">
    <button 
      className="btn btn-ghost"
      onClick={() => setShowBookingForm(false)}
    >
      Cancel
    </button>
    <button 
      className="btn btn-primary"
      onClick={handleBookAppointment}
      disabled={!selectedTimeSlot || !bookingType}
    >
      Book Appointment
    </button>
  </div>
</div>
</div>