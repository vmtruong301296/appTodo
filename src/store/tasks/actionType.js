// ─── Tasks Action Types ───────────────────────────────────────────────────────

export const TASKS_API_RESPONSE_SUCCESS = "TASKS_API_RESPONSE_SUCCESS";
export const TASKS_API_RESPONSE_ERROR = "TASKS_API_RESPONSE_ERROR";

// Fetch staff tasks list (allTasks + personalTasks + departmentTeams + todoGroups)
export const TASKS_GET_STAFF_TASKS = "TASKS_GET_STAFF_TASKS";
// Fetch definitions (priority/status dictionaries)
export const TASKS_GET_DEFINITIONS = "TASKS_GET_DEFINITIONS";

// Add task
export const TASKS_ADD_TASK = "TASKS_ADD_TASK";
export const TASKS_ADD_TASK_SUCCESS = "TASKS_ADD_TASK_SUCCESS";
export const TASKS_ADD_TASK_FAIL = "TASKS_ADD_TASK_FAIL";

// Update task (status / fields)
export const TASKS_UPDATE_TASK = "TASKS_UPDATE_TASK";
export const TASKS_UPDATE_TASK_SUCCESS = "TASKS_UPDATE_TASK_SUCCESS";
export const TASKS_UPDATE_TASK_FAIL = "TASKS_UPDATE_TASK_FAIL";

// Reset/clear
export const TASKS_CLEAR_CACHE = "TASKS_CLEAR_CACHE";
export const TASKS_CLEAR_ADD_CACHE = "TASKS_CLEAR_ADD_CACHE";
export const TASKS_CLEAR_UPDATE_CACHE = "TASKS_CLEAR_UPDATE_CACHE";
