import {
	TASKS_API_RESPONSE_SUCCESS,
	TASKS_API_RESPONSE_ERROR,
	TASKS_GET_STAFF_TASKS,
	TASKS_GET_DEFINITIONS,
	TASKS_ADD_TASK,
	TASKS_ADD_TASK_SUCCESS,
	TASKS_ADD_TASK_FAIL,
	TASKS_UPDATE_TASK,
	TASKS_UPDATE_TASK_SUCCESS,
	TASKS_UPDATE_TASK_FAIL,
	TASKS_CLEAR_CACHE,
	TASKS_CLEAR_ADD_CACHE,
	TASKS_CLEAR_UPDATE_CACHE,
} from "./actionType";

const initialState = {
	// Staff tasks data (from API)
	dataListStaffTasks: null,
	dataDefinitions: {},
	loading: false,
	error: null,

	// Add task
	addTaskLoading: false,
	addTaskSuccess: false,
	addTaskError: null,

	// Update task
	updateTaskLoading: false,
	updateTaskSuccess: false,
	updateTaskError: null,
};

const Tasks = (state = initialState, action) => {
	switch (action.type) {
		// ── Fetch staff tasks ──────────────────────────────────────────────────
		case TASKS_GET_STAFF_TASKS:
			return { ...state, loading: true, error: null };
		case TASKS_GET_DEFINITIONS:
			return { ...state, loading: true, error: null };

		case TASKS_API_RESPONSE_SUCCESS:
			if (action.payload.actionType === TASKS_GET_STAFF_TASKS) {
				return {
					...state,
					loading: false,
					dataListStaffTasks: action.payload.data,
					error: null,
				};
			}
			if (action.payload.actionType === TASKS_GET_DEFINITIONS) {
				return {
					...state,
					loading: false,
					dataDefinitions: action.payload.data || {},
					error: null,
				};
			}
			return state;

		case TASKS_API_RESPONSE_ERROR:
			if (action.payload.actionType === TASKS_GET_STAFF_TASKS) {
				return {
					...state,
					loading: false,
					error: action.payload.error,
				};
			}
			if (action.payload.actionType === TASKS_GET_DEFINITIONS) {
				return {
					...state,
					loading: false,
					error: action.payload.error,
				};
			}
			return state;

		// ── Add task ──────────────────────────────────────────────────────────
		case TASKS_ADD_TASK:
			return { ...state, addTaskLoading: true, addTaskSuccess: false, addTaskError: null };

		case TASKS_ADD_TASK_SUCCESS:
			return { ...state, addTaskLoading: false, addTaskSuccess: true, addTaskError: null };

		case TASKS_ADD_TASK_FAIL:
			return { ...state, addTaskLoading: false, addTaskSuccess: false, addTaskError: action.payload };

		case TASKS_CLEAR_ADD_CACHE:
			return { ...state, addTaskLoading: false, addTaskSuccess: false, addTaskError: null };

		// ── Update task ───────────────────────────────────────────────────────
		case TASKS_UPDATE_TASK:
			return { ...state, updateTaskLoading: true, updateTaskSuccess: false, updateTaskError: null };

		case TASKS_UPDATE_TASK_SUCCESS:
			return { ...state, updateTaskLoading: false, updateTaskSuccess: true, updateTaskError: null };

		case TASKS_UPDATE_TASK_FAIL:
			return { ...state, updateTaskLoading: false, updateTaskSuccess: false, updateTaskError: action.payload };

		case TASKS_CLEAR_UPDATE_CACHE:
			return { ...state, updateTaskLoading: false, updateTaskSuccess: false, updateTaskError: null };

		// ── Clear all ─────────────────────────────────────────────────────────
		case TASKS_CLEAR_CACHE:
			return initialState;

		default:
			return state;
	}
};

export default Tasks;
