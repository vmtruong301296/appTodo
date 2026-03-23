import { call, put, takeEvery, takeLatest, all, fork } from "redux-saga/effects";
import { toast } from "../../helpers/toast_helper";

import {
	TASKS_GET_STAFF_TASKS,
	TASKS_GET_DEFINITIONS,
	TASKS_ADD_TASK,
	TASKS_UPDATE_TASK,
} from "./actionType";

import {
	tasksApiResponseSuccess,
	tasksApiResponseError,
	tasksAddTaskSuccess,
	tasksAddTaskFail,
	tasksUpdateTaskSuccess,
	tasksUpdateTaskFail,
	masterGetListStaffTasks,
} from "./action";

import {
	transferGetData,
	transferPostData,
} from "../../helpers/fakebackend_helper_native";

// ── Fetch staff tasks ──────────────────────────────────────────────────────────
// payload = { urlAPI: "/api/tasks/get-staff-tasks", filter: {} }
function* getStaffTasksSaga({ payload: data }) {
	try {
		const response = yield call(transferGetData, data);
		yield put(tasksApiResponseSuccess(TASKS_GET_STAFF_TASKS, response));
	} catch (error) {
		yield put(tasksApiResponseError(TASKS_GET_STAFF_TASKS, error));
	}
}

// ── Fetch definitions (priority/status dictionaries) ────────────────────────
// payload = { urlAPI: "/api/definitions/definitions-list" }
function* getDefinitionsSaga({ payload: data }) {
	try {
		const response = yield call(transferGetData, data);
		yield put(tasksApiResponseSuccess(TASKS_GET_DEFINITIONS, response));
	} catch (error) {
		yield put(tasksApiResponseError(TASKS_GET_DEFINITIONS, error));
	}
}

// ── Add task ──────────────────────────────────────────────────────────────────
// payload = { urlAPI: "/api/tasks/data-save", data: { title, groupTodo, status, ... } }
function* addTaskSaga({ payload: data }) {
	try {
		const response = yield call(transferPostData, data);
		if (response?.Status === "ERROR") {
			yield put(tasksAddTaskFail(response));
			toast("Failed to create task.", "error");
		} else if (response?.error) {
			yield put(tasksAddTaskFail(response));
			toast("Failed to create task.", "error");
		} else {
			yield put(tasksAddTaskSuccess(response));
			// Refetch to sync latest data from server
			yield put(masterGetListStaffTasks());
			toast("Task created successfully!", "success");
		}
	} catch (error) {
		yield put(tasksAddTaskFail(error));
		toast("Failed to create task.", "error");
	}
}

// ── Update task ───────────────────────────────────────────────────────────────
// payload = { urlAPI: "/api/tasks/data-save", data: { id, status?, priority?, ... } }
// orders is forwarded to success payload to match web masterData behavior
function* updateTaskSaga({ payload: data, orders }) {
	try {
		const response = yield call(transferPostData, data);
		if (response?.Status === "ERROR") {
			yield put(tasksUpdateTaskFail(response));
		} else if (response?.error) {
			yield put(tasksUpdateTaskFail(response));
		} else {
			yield put(tasksUpdateTaskSuccess({ ...response, orders }));
			// Refetch to keep data in sync
			yield put(masterGetListStaffTasks());
		}
	} catch (error) {
		yield put(tasksUpdateTaskFail(error));
	}
}

// ── Watchers ──────────────────────────────────────────────────────────────────
function* watchGetStaffTasks() {
	yield takeLatest(TASKS_GET_STAFF_TASKS, getStaffTasksSaga);
}

function* watchGetDefinitions() {
	yield takeEvery(TASKS_GET_DEFINITIONS, getDefinitionsSaga);
}

function* watchAddTask() {
	yield takeEvery(TASKS_ADD_TASK, addTaskSaga);
}

function* watchUpdateTask() {
	yield takeEvery(TASKS_UPDATE_TASK, updateTaskSaga);
}

export default function* tasksSaga() {
	yield all([fork(watchGetStaffTasks), fork(watchGetDefinitions), fork(watchAddTask), fork(watchUpdateTask)]);
}
