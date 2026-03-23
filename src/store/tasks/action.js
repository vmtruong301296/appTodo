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

// Common API success / error
export const tasksApiResponseSuccess = (actionType, data) => ({
	type: TASKS_API_RESPONSE_SUCCESS,
	payload: { actionType, data },
});

export const tasksApiResponseError = (actionType, error) => ({
	type: TASKS_API_RESPONSE_ERROR,
	payload: { actionType, error },
});

// Fetch all staff tasks — payload follows the transferGetData convention: { urlAPI, filter }
export const masterGetListStaffTasks = () => ({
	type: TASKS_GET_STAFF_TASKS,
	payload: {
		// Align with web masterData action
		urlAPI: "/api/tasks/get-staff-tasks",
		filter: {},
	},
});

// Align with web listTasksGetDefinitions action
export const listTasksGetDefinitions = () => ({
	type: TASKS_GET_DEFINITIONS,
	payload: {
		urlAPI: "/api/definitions/definitions-list",
	},
});

// Add task — payload follows the transferPostData convention: { urlAPI, data }
export const masterListTasksAddTask = (data) => ({
	type: TASKS_ADD_TASK,
	payload: { urlAPI: "/api/tasks/data-save", data },
});

export const tasksAddTaskSuccess = (data) => ({
	type: TASKS_ADD_TASK_SUCCESS,
	payload: data,
});

export const tasksAddTaskFail = (error) => ({
	type: TASKS_ADD_TASK_FAIL,
	payload: error,
});

// Update task — align with web masterData action signature: (data, orders)
export const masterListTasksUpdateTaskList = (data, orders) => ({
	type: TASKS_UPDATE_TASK,
	payload: { urlAPI: "/api/tasks/data-save", data },
	orders,
});

export const tasksUpdateTaskSuccess = (data) => ({
	type: TASKS_UPDATE_TASK_SUCCESS,
	payload: data,
});

export const tasksUpdateTaskFail = (error) => ({
	type: TASKS_UPDATE_TASK_FAIL,
	payload: error,
});

// Clear caches
export const tasksClearCache = () => ({ type: TASKS_CLEAR_CACHE });
export const tasksClearAddCache = () => ({ type: TASKS_CLEAR_ADD_CACHE });
export const tasksClearUpdateCache = () => ({ type: TASKS_CLEAR_UPDATE_CACHE });
