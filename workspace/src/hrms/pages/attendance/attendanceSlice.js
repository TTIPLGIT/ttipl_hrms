import { createSlice } from "@reduxjs/toolkit";

// Initial state for attendance
const initialState = {
  attendanceId: null, // to store the attendanceId
  statusColor: "idle", // Could be 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    // Action to set the attendanceId
    setAttendanceId(state, action) {
      state.attendanceId = action.payload;
    },

    setStatus(state, action) {
      state.statusColor = action.payload;
    },
    resetAttendanceId(state) {
      state.attendanceId = null;
    },
    // New action to reset all fields to initial state
    resetAttendance(state) {
      return initialState;
    },
  },
});

// Export actions for use in components
export const {
  setAttendanceId,
  setStatus,
  resetAttendanceId,
  resetAttendance,
} = attendanceSlice.actions;

// Selectors
export const selectAttendanceId = (state) => state.attendance.attendanceId;
export const selectAttendanceStatus = (state) => state.attendance.statusColor;

// Export the reducer to add to the store
export default attendanceSlice.reducer;
