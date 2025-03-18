import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userId: null,
  userName: null,
  selectedTrainer: null,
  trainerInfo: null,
  isActive: null,
  isProfileComplete: false,
  appointments: null,

  testimonial:null,

  notifications: null,

  workouts: [],
  todayWorkoutData: null,
  tomorrowWorkoutData: null,

  nutritionPlans: [],
  todayNutritionData: null,
  tomorrowNutritionData: null,

  progress: {
    currentProgress: null,
    workoutStatus: {},
    nutritionProgress: {}, // statuses are stored
    history: [],
    summary: null,
    activeDays: null,
  },

  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload) {
        state.user = { ...state.user, ...action.payload };
        state.userId = action.payload._id;
        state.user.isAuthenticated = true;
        // state.user.userName=
      } else {
        console.error("Error: User data is missing in setUser");
      }
    },
    setProfileComplete: (state, action) => {
      if (state.user) {
        state.user.isProfileComplete = action.payload;
      } else {
        console.error(
          "Error: User is not defined when setting isProfileComplete"
        );
      }
    },
    setSelectedTrainer: (state, action) => {
      state.selectedTrainer = action.payload;
    },
    setIsActive: (state, action) => {
      state.isActive = action.payload;
    },
    updateUserProfilePic: (state, action) => {
      if (state.user) {
        // console.log(
        //   "inside Reducer updateUserProfilePic : action.payload : ",
        //   action.payload
        // );

        state.user = { ...state.user, image: action.payload };
        // console.log("image after updatereducer :", state.user.image);
      } else {
        console.error(
          "Error: User is not defined when updating profile picture"
        );
      }
    },

    setTrainerInfo: (state, action) => {
      state.trainerInfo = action.payload;
    },
    updateTrainerReview: (state, action) => {
      if (state.trainerInfo) {
        state.trainerInfo = action.payload;
      }
    },


    setNutritions: (state, action) => {
      state.nutritionPlans = action.payload;
    },
    setTodayNutrition: (state, action) => {
      state.todayNutritionData = action.payload;
    },
    setTomorrowNutrition: (state, action) => {
      state.tomorrowNutritionData = action.payload;
    },

    updateNutritionProgress: (state, action) => {
      const { nutritionId, progress } = action.payload;
      // Store progress by nutritionId for easy lookup
      state.progress.nutritionProgress = {
        ...state.progress.nutritionProgress,
        [nutritionId]: progress,
      };
    },

    setWorkouts: (state, action) => {
      state.workouts = action.payload;
    },
    setTodayWorkoutR: (state, action) => {
      state.todayWorkoutData = action.payload;
    },
    setTomorrowWorkoutR: (state, action) => {
      state.tomorrowWorkoutData = action.payload;
    },

    setProgress: (state, action) => {
      state.progress = action.payload;
    },

    setWorkoutInProgress: (state, action) => {
      const { workoutId } = action.payload;
      if (!state.progress) {
        state.progress = { workoutStatus: {} };
      }
      if (!state.progress.workoutStatus) {
        state.progress.workoutStatus = {};
      }
      state.progress.workoutStatus[workoutId] = "inProgress";
    },
    // resetWorkoutStatus: (state, action) => {
    //   const { workoutId } = action.payload;
    //   state.progress.workoutStatus[workoutId] = 'pending';
    // },
    updateWorkoutStatus: (state, action) => {
      const { workoutId, status } = action.payload;
      state.progress.workoutStatus[workoutId] = status;
      // console.log(" update workout status in redux action.payload :",action.payload);

      // console.log(" inside redux updateWorkoutststus Wrokout : status",workoutId ,":",status);
      // console.log(" inside redux updateWorkoutststus status",state.progress.workoutStatus[workoutId]);
      // console.log(" inside redux updateWorkoutststus workooutid",state.workouts[workoutId]);
    },
    // updateWorkoutStatuses: (state, action) => {
    //       const { statuses } = action.payload;
    //       // Update multiple workout statuses at once
    //       Object.keys(statuses).forEach(workoutId => {
    //         state.progress.workoutStatus[workoutId] = statuses[workoutId];
    //       });

    //     },

    setAppointmentR: (state, action) => {
      state.appointments = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },

    setTestimonial:(state,action)=>{
      state.testimonial=action.payload;
    },

    clearUser: (state) => {
      state.user = initialState;
      state.isAuthenticated = false;
      state.isProfileComplete = false;
      return initialState;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  setProfileComplete,
  setIsActive,
  updateUserProfilePic,
  setSelectedTrainer,
  setTrainerInfo,
  updateTrainerReview,


  setAppointmentR,

  setNutritions,
  updateNutritionProgress,
  setTodayNutrition,
  setTomorrowNutrition,

  setWorkouts,
  setTodayWorkoutR,
  setTomorrowWorkoutR,
  setProgress,
  setWorkoutInProgress,
  // resetWorkoutStatus,
  updateWorkoutStatus,
  // updateWorkoutStatuses,

    setTestimonial,
  setNotifications,
  logout,
} = userSlice.actions;
export default userSlice.reducer;
