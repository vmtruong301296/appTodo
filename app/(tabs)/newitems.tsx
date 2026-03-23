import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Modal,
	Animated,
	Pressable,
	Image,
	Platform,
	KeyboardAvoidingView,
	PanResponder,
	Switch,
	Alert,
	ActivityIndicator,
	Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
	logoutUser,
	listTasksGetDefinitions,
	masterGetListStaffTasks,
	masterListTasksAddTask,
	masterListTasksUpdateTaskList,
} from "../../src/store/actions";
import { transferPostData } from "../../src/helpers/fakebackend_helper_native";
import { api } from "../../src/config";
import getSocketClientERP from "../../src/utils/socketClientERP";
import {
	Search,
	X,
	Plus,
	Info,
	Clock,
	Check,
	Play,
	AlertCircle,
	ListTodo,
	PlayCircle,
	Layers,
	Zap,
	Package,
	Wrench,
	CheckCircle,
	Box,
	Calendar,
	User,
	LayoutDashboard,
	FlaskConical,
	PackageOpen,
	ChevronRight,
	ChevronLeft,
	Bell,
	ExternalLink,
	Archive,
	Camera,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

// ─── Types ───────────────────────────────────────────────────────────────────
type Priority = "High" | "Medium" | "Low";
type PriorityValue = Priority | "";
type TaskStatus = "todo" | "in-progress" | "pending" | "done" | "closed";
type TabKey = "Todo" | "In Progress" | "Pending" | "Done" | "Closed";

interface Assignee {
	name: string;
	role: "lead" | "support";
}
/** Nhóm gán việc — giống task.assignedGroup trên web */
interface AssignedGroupItem {
	id: string;
	code?: string;
	fullName?: string;
}
interface TaskFileItem {
	id?: string;
	name?: string;
	url?: string;
	type?: string;
}
interface AssignmentPoolItem {
	id: string;
	type: "person" | "group";
	fullName?: string;
	firstName?: string;
	code?: string;
}
interface Note {
	author: string;
	text: string;
	time?: string;
}
interface Task {
	id: string;
	title: string;
	category: string;
	priority: PriorityValue;
	due: string;
	source: string;
	sourceLink?: string;
	projectCode?: string;
	assignees: Assignee[];
	status: TaskStatus;
	notes: Note[];
	acknowledged: boolean;
	requiredImage?: boolean;
	isImage?: boolean;
	requiredPdf?: boolean;
	requiresAction?: string;
	listFiles?: TaskFileItem[];
	description?: string;
	createdBy?: string;
	assignedGroup?: AssignedGroupItem[];
	// Raw API fields kept for edit-mode pre-fill (mirrors web CreateTaskModal)
	report?: string;
	project?: string;
	projectId?: string;
	startDate?: string;
	dueDate?: string;
	score?: number;
	estEffort?: number;
	priorityOfAssignter?: string;
	rawStatus?: string;
	rawPriority?: string;
	rawAssignerIds?: string[];
	rawGroupIds?: string[];
}
interface TeamMember {
	name: string;
	initials: string;
	color: string;
	roles: string[];
	status: "online" | "away";
}

type NotificationItem = {
	id: number;
	title: string;
	description: string;
	time: string;
	type: "task" | "issue" | "system";
};

// ─── API Normalizers ─────────────────────────────────────────────────────────

/**
 * Map API priority string or priorityNum → local Priority.
 * API values: "ASAP" | "Today" | "High" | "Medium" | "Low" | ""
 * priorityNum: 0 = none/low, 1 = medium, 2+ = high
 */
function normalizeApiPriority(p: string = "", priorityNum?: number): PriorityValue {
	if (p === "ASAP" || p === "Today" || p === "High") return "High";
	if (p === "Medium") return "Medium";
	if (p === "Low") return "Low";
	// Fall back to numeric priority when string field is absent
	if (typeof priorityNum === "number") {
		if (priorityNum >= 2) return "High";
		if (priorityNum === 1) return "Medium";
	}
	return "";
}

// Meta config cho priority – tương tự listPriority + PRIORITY_COLORS bên web
const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
	High: { label: "High (Urgent)", color: "#ef4444" },
	Medium: { label: "Medium", color: "#f59e0b" },
	Low: { label: "Low", color: "#10b981" },
};

/** Map API status string → local TaskStatus */
function normalizeApiStatus(s: string = ""): TaskStatus {
	if (s === "To Do" || s === "Todo") return "todo";
	if (s === "In Progress") return "in-progress";
	if (s === "Pending") return "pending";
	if (s === "Done") return "done";
	if (s === "Closed") return "closed";
	// Fallback from unknown/empty values
	return "pending";
}

/** Map local TaskStatus → API status string */
function localStatusToApi(s: TaskStatus): string {
	if (s === "todo") return "To Do";
	if (s === "in-progress") return "In Progress";
	if (s === "pending") return "Pending";
	if (s === "done") return "Done";
	return "Closed";
}

/**
 * Format a date string into a human-friendly relative label.
 * e.g. "2025-05-26T04:19:31.401Z" → "May 26"
 */
function formatDueDate(dateStr?: string): string {
	if (!dateStr) return "—";
	try {
		const d = new Date(dateStr);
		const now = new Date();
		const diffMs = d.getTime() - now.getTime();
		const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
		if (diffHrs > 0 && diffHrs <= 24) return `${diffHrs}h`;
		if (diffHrs < 0 && diffHrs >= -24) return `${Math.abs(diffHrs)}h ago`;
		return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
	} catch {
		return "—";
	}
}

/**
 * Convert a raw API task object to the local Task shape.
 *
 * API fields used:
 *  id, title, groupTodo, priority, priorityNum, dueDate, updatedAt,
 *  status, project, otherLink, assigner[], createdBy, description, notes[]
 */
function apiTaskToLocal(t: any): Task {
	if(t.projectInfo?.code === "PKG00514"){
		// console.log("t 123: ",t);
	}
	// ── Assignees ──────────────────────────────────────────────────────────────
	const assignerList: any[] = Array.isArray(t.assigner) ? t.assigner : [];
	let assignees: Assignee[];
	if (assignerList.length > 0) {
		assignees = assignerList.map((a, i) => ({
			name: a.fullName || `${a.firstName || ""} ${a.lastName || ""}`.trim() || a.code || "Unknown",
			role: (i === 0 ? "lead" : "support") as "lead" | "support",
		}));
	} else if (t.createdBy) {
		// No explicit assignee — show the creator as lead
		const cb = t.createdBy;
		assignees = [{ name: cb.fullName || `${cb.firstName || ""} ${cb.lastName || ""}`.trim() || cb.code || "Unknown", role: "lead" }];
	} else {
		// Không có assigner -> để rỗng, không render \"Unassigned\"
		assignees = [];
	}

	// ── Source: prefer linked document code, fallback to project name ──────────
	const source = t.otherLink?.code || t.otherLink?.type || t.project || "Manual";
	const sourceLink: string | undefined = t.otherLink?.url;

	// ── Due date ───────────────────────────────────────────────────────────────
	const due = formatDueDate(t.dueDate || t.updatedAt);

	// ── Notes: description becomes the first note (if present) ────────────────
	const notes: Note[] = [];
	if (t.description?.trim()) {
		const cbName = t.createdBy?.fullName || t.createdBy?.firstName || "System";
		notes.push({ author: cbName, text: t.description.trim() });
	}
	(t.notes || []).forEach((n: any) => {
		const authorName =
			typeof n.createdBy === "object"
				? n.createdBy?.fullName || n.createdBy?.firstName || "System"
				: n.author || n.createdBy || "System";
		notes.push({
			author: authorName,
			text: n.content || n.text || "",
			time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
		});
	});

	// Raw IDs for edit payload (web: assignerIds + groupIds → selIds)
	const rawAssignerIds = assignerList.map((a: any) => String(a.id || "")).filter(Boolean);
	const rawGroupIds = (t.assignedGroup || []).map((g: any) => String(g.id || "")).filter(Boolean);

	// Raw priority mapping (web: "Today"/"ASAP" → {id:"Today",code:"High"})
	const rawPriority =
		t.priority === "Today" || t.priority === "ASAP"
			? "Today"
			: t.priority || "";

	return {
		id: t.id || t._id,
		title: t.title || "(No title)",
		category: t.groupTodo || "Misc",
		priority: normalizeApiPriority(t.priority, t.priorityNum),
		due,
		source,
		sourceLink,
		projectCode: t.projectInfo?.code || t.otherLink?.code,
		assignees,
		status: normalizeApiStatus(t.status),
		notes,
		acknowledged: t.acknowledged ?? (t.status === "Done" || t.status === "Closed"),
		requiredImage: !!t.requiredImage || t.requiresAction === "camera",
		isImage: !!t.isImage,
		requiredPdf: !!t.requiredPdf,
		requiresAction: t.requiresAction,
		listFiles: Array.isArray(t.listFiles)
			? t.listFiles.map((f: any) => ({
					id: f.id ? String(f.id) : undefined,
					name: f.name,
					url: f.url,
					type: f.type,
				}))
			: [],
		description: t.description,
		createdBy: t.createdBy?.fullName || t.createdBy?.firstName,
		assignedGroup: Array.isArray(t.assignedGroup)
			? t.assignedGroup.map((g: any) => ({
					id: String(g.id ?? ""),
					code: g.code,
					fullName: g.fullName,
				}))
			: [],
		// Raw API fields for edit mode pre-fill (mirrors web CreateTaskModal L216-L292)
		report: t.report || "",
		project: t.project || "",
		projectId: t.projectId || "",
		startDate: t.startDate || "",
		dueDate: t.dueDate || "",
		score: Number(t.score) || 0,
		estEffort: Number(t.estEffort) || 0,
		priorityOfAssignter: t.priorityOfAssignter || "",
		rawStatus: t.status || "",
		rawPriority,
		rawAssignerIds,
		rawGroupIds,
	};
}

// ─── Constants ───────────────────────────────────────────────────────────────
const CURRENT_USER = { name: "Frank", initials: "FK", color: "#6366f1" };

const TEAM: TeamMember[] = [
	{ name: "Joe", initials: "JD", color: "#3b82f6", roles: ["Tester", "Unpack", "Pack", "Repair", "Misc"], status: "online" },
	{ name: "Anna", initials: "AN", color: "#ec4899", roles: ["Tester", "Pack"], status: "online" },
	{ name: "Mike", initials: "MK", color: "#10b981", roles: ["Repair", "Misc"], status: "away" },
	{ name: "Frank", initials: "FK", color: "#6366f1", roles: ["Tester", "Pack", "Misc"], status: "online" },
];

const CATEGORIES = ["All", "Urgent", "Tester", "Unpack", "Pack", "Repair", "Listing", "Misc"];
const CREATE_CATEGORIES = ["Tester", "Unpack", "Pack", "Repair", "Listing", "Misc"];

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; Icon: React.ComponentType<any> }> = {
	All: { color: "#475569", bg: "#f8fafc", Icon: LayoutDashboard },
	Urgent: { color: "#ef4444", bg: "#fef2f2", Icon: Zap },
	Tester: { color: "#6366f1", bg: "#eef2ff", Icon: FlaskConical },
	Unpack: { color: "#a855f7", bg: "#faf5ff", Icon: PackageOpen },
	Pack: { color: "#f97316", bg: "#fff7ed", Icon: Box },
	Repair: { color: "#10b981", bg: "#f0fdf4", Icon: Wrench },
	Listing: { color: "#0ea5e9", bg: "#e0f2fe", Icon: Package },
	Misc: { color: "#64748b", bg: "#f1f5f9", Icon: Layers },
};

const TAB_CONFIG: { key: TabKey; label: string; Icon: React.ComponentType<any>; color: string; badgeColor: string; status: TaskStatus }[] = [
	{ key: "Todo", label: "Todo", Icon: ListTodo, color: "#6366f1", badgeColor: "#6366f1", status: "todo" },
	{ key: "In Progress", label: "Doing", Icon: PlayCircle, color: "#3b82f6", badgeColor: "#3b82f6", status: "in-progress" },
	{ key: "Pending", label: "Pending", Icon: AlertCircle, color: "#f59e0b", badgeColor: "#f59e0b", status: "pending" },
	{ key: "Done", label: "Done", Icon: CheckCircle, color: "#10b981", badgeColor: "#10b981", status: "done" },
	{ key: "Closed", label: "Closed", Icon: Archive, color: "#64748b", badgeColor: "#64748b", status: "closed" },
];

const NOTIFICATIONS: NotificationItem[] = [
	{
		id: 1,
		title: "3 new urgent tasks",
		description: "High priority items just assigned to you.",
		time: "2m ago",
		type: "task",
	},
	{
		id: 2,
		title: "Issue flagged on Pack line",
		description: "Order #ORD-5521 reported packaging issue.",
		time: "15m ago",
		type: "issue",
	},
	{
		id: 3,
		title: "System maintenance tonight",
		description: "ERP will be read-only from 23:00–23:30.",
		time: "1h ago",
		type: "system",
	},
];

const INITIAL_TASKS: Task[] = [];

// ─── UI Helpers ──────────────────────────────────────────────────────────────

/** Derive 2-letter initials from a full name.
 *  "Team Dev Cong" → "TC", "AIP Supply" → "AS", "Frank" → "FR".
 */
/** Màu ổn định từ id — giống TaskBottomPanel stringToColor */
function stringToColor(str = ""): string {
	const palette = ["#3b82f6", "#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];
	let hash = 0;
	for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
	return palette[Math.abs(hash) % palette.length];
}

function getInitialsFromName(name?: string | null): string {
	if (!name) return "??";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "??";
	if (parts.length === 1) {
		const word = parts[0];
		if (word.length === 1) return word[0]!.toUpperCase();
		return (word[0]! + word[1]!).toUpperCase();
	}
	const first = parts[0][0] ?? "";
	const last = parts[parts.length - 1][0] ?? "";
	const two = (first + last).toUpperCase();
	return two || "??";
}

/** Ensure detail sheet always receives a fully-initialized task object.
 *  Mirrors web CreateTaskModal pre-fill logic (lines 216-292).
 */
function withDetailDefaults(task: Task): Task {
	return {
		id: task.id || `local_${Date.now()}`,
		title: task.title || "",
		category: task.category || "",
		priority: task.priority || "",
		due: task.due || "—",
		source: task.source || "",
		sourceLink: task.sourceLink,
		projectCode: task.projectCode,
		assignees: Array.isArray(task.assignees) ? task.assignees : [],
		status: task.status || "",
		notes: Array.isArray(task.notes) ? task.notes : [],
		acknowledged: task.acknowledged ?? false,
		requiredImage: !!task.requiredImage,
		isImage: !!task.isImage,
		requiredPdf: !!task.requiredPdf,
		requiresAction: task.requiresAction,
		listFiles: Array.isArray(task.listFiles) ? task.listFiles : [],
		description: task.description || "",
		createdBy: task.createdBy || "",
		assignedGroup: Array.isArray(task.assignedGroup) ? task.assignedGroup : [],
		// Raw API fields for edit-mode payload (web CreateTaskModal pre-fill)
		report: task.report || "",
		project: task.project || "",
		projectId: task.projectId || "",
		startDate: task.startDate || "",
		dueDate: task.dueDate || "",
		score: task.score ?? 0,
		estEffort: task.estEffort ?? 0,
		priorityOfAssignter: task.priorityOfAssignter || "",
		rawStatus: task.rawStatus || "",
		rawPriority: task.rawPriority || "",
		rawAssignerIds: Array.isArray(task.rawAssignerIds) ? task.rawAssignerIds : [],
		rawGroupIds: Array.isArray(task.rawGroupIds) ? task.rawGroupIds : [],
	};
}

function resolveFileUrl(url?: string): string {
	if (!url) return "";
	// Local file captured from camera (expo-image-picker) – use as is
	if (url.startsWith("file://")) return url;
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	return `${api.API_URL}${url}`;
}

function isImageFile(file: TaskFileItem): boolean {
	const name = (file.name || "").toLowerCase();
	return /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
}

function isPdfFile(file: TaskFileItem): boolean {
	return /\.pdf$/i.test((file.name || "").toLowerCase());
}

async function openTaskFile(file: TaskFileItem): Promise<void> {
	const fileUrl = resolveFileUrl(file.url);
	if (!fileUrl) return;

	// PDF often fails with Linking on devices lacking external handlers.
	// Use in-app browser for reliable viewing.
	if (isPdfFile(file)) {
		await WebBrowser.openBrowserAsync(fileUrl);
		return;
	}

	const supported = await Linking.canOpenURL(fileUrl);
	if (supported) {
		await Linking.openURL(fileUrl);
		return;
	}
	// Fallback to in-app browser for unknown file types.
	await WebBrowser.openBrowserAsync(fileUrl);
}

// ─── Task Card ────────────────────────────────────────────────────────────────
interface TaskCardProps {
	task: Task;
	onPress: (task: Task) => void;
	onStart: (id: string) => void;
	onComplete: (id: string) => void;
}

function TaskCard({ task, onPress, onStart, onComplete }: TaskCardProps) {
	const lead = task.assignees.find((a) => a.role === "lead") || task.assignees[0];
	const member = TEAM.find((m) => m.name === lead?.name);
	const isUrgent = task.priority === "High";

	// Pulsing border animation for urgent cards
	const pulseAnim = useRef(new Animated.Value(0.15)).current;
	useEffect(() => {
		if (!isUrgent) return;
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
				Animated.timing(pulseAnim, { toValue: 0.15, duration: 800, useNativeDriver: true }),
			]),
		);
		loop.start();
		return () => loop.stop();
	}, [isUrgent]);

	return (
		<TouchableOpacity style={[styles.taskCard, isUrgent && styles.urgentCard]} onPress={() => onPress(task)} activeOpacity={0.75}>
			{/* Pulsing glow border overlay */}
			{isUrgent && <Animated.View pointerEvents="none" style={[styles.urgentGlowBorder, { opacity: pulseAnim }]} />}
			<View style={styles.taskCardHeader}>
				<Text style={styles.taskCategory}>{task.category.toUpperCase()}</Text>
				<View style={styles.taskDueRow}>
					<Clock size={11} color="#94a3b8" />
					<Text style={styles.taskDue}>{task.due}</Text>
				</View>
			</View>
			<Text style={styles.taskTitle}>{task.title}</Text>
			<View style={styles.taskCardFooter}>
				{(task.assignees.length > 0 && lead) || (task.assignedGroup && task.assignedGroup.length > 0) ? (
					<View style={styles.assigneeRow}>
						{/* Avatar nhóm — overlap giống web avatar-group */}
						<View style={styles.avatarGroup}>
							{task.assignees.length > 0 && lead && (
								<View style={[styles.avatarSm, { backgroundColor: member?.color || "#6366f1" }]}>
									<Text style={styles.avatarSmText}>
										{getInitialsFromName(lead?.name || member?.name || member?.initials)}
									</Text>
								</View>
							)}
							{(task.assignedGroup || []).map((g: AssignedGroupItem, idx: number) => (
								<View
									key={g.id || `g-${idx}`}
									style={[
										styles.avatarGroupCircle,
										{
											backgroundColor: stringToColor(g.id),
											marginLeft: task.assignees.length > 0 && idx === 0 ? 4 : idx === 0 ? 0 : -6,
										},
									]}>
									<Text style={styles.avatarSmText}>
										{(g.code || "").substring(0, 2).toUpperCase() || "T"}
									</Text>
								</View>
							))}
						</View>
						{task.assignees.length > 0 && lead?.name ? (
							<Text style={styles.assigneeName}>
								{lead.name}
								{task.assignees.length > 1 ? (
									<Text style={styles.assigneeExtra}> +{task.assignees.length - 1}</Text>
								) : null}
							</Text>
						) : null}
					</View>
				) : null}
				<View style={styles.cardActions}>
					{task.projectCode ? (
						<View style={styles.projectBadge}>
							<Text style={styles.projectBadgeText} numberOfLines={1}>
								{task.projectCode}
							</Text>
						</View>
					) : (
						<>
							{(task.status === "todo" || task.status === "pending") && (
								<TouchableOpacity
									style={[styles.actionBtn, { backgroundColor: "#eef2ff" }]}
									onPress={() => onStart(task.id)}
									hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}>
									<Play size={13} color="#6366f1" fill="#6366f1" />
								</TouchableOpacity>
							)}
							<TouchableOpacity
								style={[styles.actionBtn, { backgroundColor: "#f0fdf4" }]}
								onPress={() => onComplete(task.id)}
								hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
								<Check size={13} color="#10b981" />
							</TouchableOpacity>
						</>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function TasksScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const dispatch = useDispatch();

	// ── Redux state ────────────────────────────────────────────────────────────
	const { dataListStaffTasks, dataDefinitions, loading: tasksLoading } = useSelector((state: any) => state.DashboardMasterData);

	// ── Local state ────────────────────────────────────────────────────────────
	const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [activeTab, setActiveTab] = useState<TabKey>("Todo");
	const [activeCategory, setActiveCategory] = useState("All");
	const [showAllCategories, setShowAllCategories] = useState(false);
	const [showCategoryPicker, setShowCategoryPicker] = useState(false);
	const [showPriorityPicker, setShowPriorityPicker] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [searchQuery, setSearchQuery] = useState(""); //PKG00514
	const [showSearch, setShowSearch] = useState(false);
	const [viewingAs, setViewingAs] = useState(CURRENT_USER.name);

	// Detail sheet
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [showDetail, setShowDetail] = useState(false);
	const detailAnim = useRef(new Animated.Value(900)).current;

	const detailPanResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
			onPanResponderMove: (_, gestureState) => {
				if (gestureState.dy > 0) {
					detailAnim.setValue(gestureState.dy);
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				if (gestureState.dy > 80 || gestureState.vy > 0.5) {
					slideDown(detailAnim, () => setShowDetail(false));
				} else {
					slideUp(detailAnim);
				}
			},
		}),
	).current;

	// Create sheet
	const [showCreate, setShowCreate] = useState(false);
	const createAnim = useRef(new Animated.Value(900)).current;
	const [newTitle, setNewTitle] = useState("");
	const [newCategory, setNewCategory] = useState("Misc");
	const [newPriority, setNewPriority] = useState<Priority>("Medium");
	const [newDesc, setNewDesc] = useState("");
	const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
	const [newPhotoRequired, setNewPhotoRequired] = useState(false);

	// Staff sheet
	const [showStaff, setShowStaff] = useState(false);
	const staffAnim = useRef(new Animated.Value(900)).current;

	const staffPanResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (_, gs) => gs.dy > 5,
			onPanResponderMove: (_, gs) => {
				if (gs.dy > 0) staffAnim.setValue(gs.dy);
			},
			onPanResponderRelease: (_, gs) => {
				if (gs.dy > 80 || gs.vy > 0.5) {
					Animated.timing(staffAnim, { toValue: 900, duration: 280, useNativeDriver: true }).start(() => setShowStaff(false));
				} else {
					Animated.spring(staffAnim, { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }).start();
				}
			},
		}),
	).current;

	// ── Fetch on mount ─────────────────────────────────────────────────────────
	useEffect(() => {
		dispatch(masterGetListStaffTasks() as any);
		dispatch(listTasksGetDefinitions() as any);
	}, []);

	// ── Sync Redux data → local tasks state ────────────────────────────────────
	useEffect(() => {
		if (!dataListStaffTasks) return;
		const rawAll: any[] = dataListStaffTasks.allTasks || [];
		if (rawAll.length > 0) {
			setTasks(rawAll.map(apiTaskToLocal));
		}
	}, [dataListStaffTasks]);

	// ── Socket: join room + listen for data-change events ──────────────────────
	useEffect(() => {
		let socket: ReturnType<typeof getSocketClientERP>;
		try {
			socket = getSocketClientERP();
			socket.on("connect", () => {
				socket.emit("join-project-room", { projectRoom: "room-to-do" });
			});
			socket.on("UpdateProjectData", () => {
				dispatch(masterGetListStaffTasks() as any);
			});
		} catch (e) {
			// Socket connection errors should not crash the app
			console.warn("Socket connection error:", e);
		}
		return () => {
			try {
				socket?.off("UpdateProjectData");
				socket?.disconnect();
			} catch (_) {}
		};
	}, []);

	// ─── Derived ──────────────────────────────────────────────────────────────
	// Team Assignment source (web-like): aggregate assigners/groups from API allTasks
	const assignmentPool = useMemo<AssignmentPoolItem[]>(() => {
		const map = new Map<string, AssignmentPoolItem>();
		const rawAll: any[] = dataListStaffTasks?.allTasks || [];
		rawAll.forEach((t: any) => {
			(t?.assigner || []).forEach((a: any) => {
				const id = String(a?.id || a?.userId || a?.code || a?.fullName || a?.firstName || "");
				if (!id) return;
				if (!map.has(`person:${id}`)) {
					map.set(`person:${id}`, {
						id,
						type: "person",
						fullName: a?.fullName,
						firstName: a?.firstName,
						code: a?.code,
					});
				}
			});
			(t?.assignedGroup || []).forEach((g: any) => {
				const id = String(g?.id || g?.code || g?.fullName || "");
				if (!id) return;
				if (!map.has(`group:${id}`)) {
					map.set(`group:${id}`, {
						id,
						type: "group",
						fullName: g?.fullName,
						code: g?.code,
					});
				}
			});
		});
		// Ensure current user always present as assignable person
		const selfId = String(CURRENT_USER.name);
		if (!map.has(`person:${selfId}`)) {
			map.set(`person:${selfId}`, { id: selfId, type: "person", fullName: CURRENT_USER.name });
		}
		return Array.from(map.values());
	}, [dataListStaffTasks]);

	// With real API data, assigner[] is often empty and names won't match local
	// TEAM member names. Show all tasks when viewingAs is the current user or
	// when no tasks match the filter (prevents empty list for unmatched users).
	const baseTasks = useMemo(() => {
		const matched = tasks.filter((t) => t.assignees.some((a) => a.name === viewingAs));
		return matched.length > 0 ? matched : tasks;
	}, [tasks, viewingAs]);

	const filteredTasks = useMemo(() => {
		const statusMap: Record<TabKey, TaskStatus> = {
			Todo: "todo",
			"In Progress": "in-progress",
			Pending: "pending",
			Done: "done",
			Closed: "closed",
		};

		// Step 1: filter theo status, category, search
		const list = baseTasks.filter((t) => {
			if (t.status !== statusMap[activeTab]) return false;
			if (activeCategory === "Urgent" && t.priority !== "High") return false;
			if (activeCategory !== "All" && activeCategory !== "Urgent" && t.category !== activeCategory) return false;
			if (searchQuery) {
				const q = searchQuery.toLowerCase();
				const assigneeNames = (t.assignees || []).map((a) => a.name || "").join(" ").toLowerCase();
				const assignedGroupText = (t.assignedGroup || [])
					.map((g) => `${g.code || ""} ${g.fullName || ""}`)
					.join(" ")
					.toLowerCase();
				const projectCode = (t.projectCode || "").toLowerCase();
				const title = (t.title || "").toLowerCase();

				const isMatched =
					title.includes(q) || projectCode.includes(q) || assigneeNames.includes(q) || assignedGroupText.includes(q);
				if (!isMatched) return false;
			}
			return true;
		});

		// Step 2: group theo thứ tự category xuất hiện lần đầu
		const buckets = new Map<string, Task[]>();
		for (const t of list) {
			const key = t.category || "Misc";
			let arr = buckets.get(key);
			if (!arr) {
				arr = [];
				buckets.set(key, arr);
			}
			arr.push(t);
		}

		const seen = new Set<string>();
		const ordered: Task[] = [];
		for (const t of list) {
			const key = t.category || "Misc";
			if (seen.has(key)) continue;
			seen.add(key);
			const group = buckets.get(key);
			if (group && group.length) {
				ordered.push(...group);
			}
		}
		return ordered;
	}, [baseTasks, activeTab, activeCategory, searchQuery]);

	// Counts by tab should follow selected category (not global baseTasks)
	const tasksInActiveCategory = useMemo(() => {
		return baseTasks.filter((t) => {
			if (activeCategory === "Urgent") return t.priority === "High";
			if (activeCategory === "All") return true;
			return t.category === activeCategory;
		});
	}, [baseTasks, activeCategory]);

	const counts = useMemo(
		() => ({
			Todo: tasksInActiveCategory.filter((t) => t.status === "todo").length,
			InProgress: tasksInActiveCategory.filter((t) => t.status === "in-progress").length,
			Pending: tasksInActiveCategory.filter((t) => t.status === "pending").length,
			Done: tasksInActiveCategory.filter((t) => t.status === "done").length,
			Closed: tasksInActiveCategory.filter((t) => t.status === "closed").length,
		}),
		[tasksInActiveCategory],
	);

	const categoryCounts = useMemo(() => {
		const nonDone = baseTasks.filter((t) => t.status !== "done" && t.status !== "closed");
		return {
			All: baseTasks.length,
			Urgent: nonDone.filter((t) => t.priority === "High").length,
			Tester: nonDone.filter((t) => t.category === "Tester").length,
			Unpack: nonDone.filter((t) => t.category === "Unpack").length,
			Pack: nonDone.filter((t) => t.category === "Pack").length,
			Repair: nonDone.filter((t) => t.category === "Repair").length,
			Listing: nonDone.filter((t) => t.category === "Listing").length,
			Misc: nonDone.filter((t) => t.category === "Misc").length,
		};
	}, [baseTasks]);

	// Priority list from definitions (align web CreateTaskModal/listTasksGetDefinitions)
	const priorityOptions = useMemo(() => {
		const raw = Object.values((dataDefinitions?.PRIORITY_OF_TASK ?? {}) as Record<string, string>);
		const mapped = raw
			.filter((item) => item !== "ASAP")
			.map((item) => {
				const code = item === "Today" ? "High" : item;
				const ui = (normalizeApiPriority(code) || "Low") as Priority;
				return { id: item, code, ui };
			});

		// Keep first-seen order, remove duplicate visible codes
		const seen = new Set<string>();
		const deduped = mapped.filter((p) => {
			if (seen.has(p.code)) return false;
			seen.add(p.code);
			return true;
		});

		// Fallback when definitions are not ready
		if (deduped.length === 0) {
			return [
				{ id: "Low", code: "Low", ui: "Low" as Priority },
				{ id: "Medium", code: "Medium", ui: "Medium" as Priority },
				{ id: "High", code: "High", ui: "High" as Priority },
			];
		}
		return deduped;
	}, [dataDefinitions]);

	const currentViewer = TEAM.find((m) => m.name === viewingAs) || TEAM[3];
	const unreadCount = NOTIFICATIONS.length;

	// ─── Handlers ─────────────────────────────────────────────────────────────
	const updateStatus = useCallback(
		(id: string, status: TaskStatus) => {
			// Optimistic update
			setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
			// Persist to API
			dispatch(masterListTasksUpdateTaskList({ id, status: localStatusToApi(status) }) as any);
		},
		[dispatch],
	);

	function slideUp(anim: Animated.Value) {
		Animated.spring(anim, { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }).start();
	}
	function slideDown(anim: Animated.Value, callback?: () => void) {
		Animated.timing(anim, { toValue: 900, duration: 280, useNativeDriver: true }).start(callback);
	}

	function openDetail(task: Task) {
		setSelectedTask(withDetailDefaults(task));
		setShowDetail(true);
		slideUp(detailAnim);
	}
	function closeDetail() {
		slideDown(detailAnim, () => setShowDetail(false));
	}

	function openCreate() {
		setNewTitle("");
		setNewCategory("Misc");
		setNewPriority("Medium");
		setNewDesc("");
		setSelectedAssignees([]);
		setNewPhotoRequired(false);
		setShowCategoryPicker(false);
		setShowPriorityPicker(false);
		setShowCreate(true);
		slideUp(createAnim);
	}
	function closeCreate() {
		setShowCreate(false);
	}

	function submitTask() {
		if (!newTitle.trim()) return;
		if (selectedAssignees.length === 0) return;

		// Optimistic local update (temp string id, replaced when API data arrives)
		const localTask: Task = {
			id: `local_${Date.now()}`,
			title: newTitle.trim(),
			category: newCategory,
			priority: newPriority,
			due: "—",
			source: "Manual",
			assignees: selectedAssignees.map((n, i) => ({ name: n, role: i === 0 ? "lead" : "support" })),
			status: "todo",
			notes: newDesc.trim() ? [{ author: CURRENT_USER.name, text: newDesc.trim() }] : [],
			acknowledged: false,
			requiredImage: !!newPhotoRequired,
			requiredPdf: false,
			...(newPhotoRequired ? { requiresAction: "camera" } : {}),
			listFiles: [],
		};
		setTasks((prev) => [localTask, ...prev]);

		// Persist to API (same payload shape as the web version)
		const selectedPoolItems = (assignmentPool || []).filter((a) => {
			const label = (a.fullName || a.firstName || a.code || "").trim().toLowerCase();
			return selectedAssignees.some((n) => n.trim().toLowerCase() === label);
		});
		const assignedId = selectedPoolItems.filter((a) => a.type !== "group").map((a) => a.id);
		const assignedGroupId = selectedPoolItems.filter((a) => a.type === "group").map((a) => a.id);
		const priorityId = newPriority === "High" ? "Today" : newPriority === "Medium" ? "Medium" : "Low";
		const fmtStartDate = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
		dispatch(
			masterListTasksAddTask({
				project: "",
				projectId: "",
				title: newTitle.trim(),
				description: newDesc.trim(),
				report: "",
				status: "To Do",
				assignedId,
				assignedGroupId,
				statusOfProject: "",
				groupTodo: newCategory,
				priority: priorityId,
				estEffort: 0,
				score: 0,
				orders: 0,
				orgId: "",
				collectionNameTask: "",
				priorityOfAssignter: "",
				startDate: fmtStartDate,
				dueDate: "",
				requiredImage: newPhotoRequired ? 1 : 0,
				requiredPdf: 0,
				configRepeatTask: {
					optionCreate: {
						option: "None",
						valueDay: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
						every: 1,
						afterDate: "",
					},
					stopCreate: { option: 1, value: 1 },
				},
				...(newPhotoRequired ? { requiresAction: "camera" } : {}),
			}) as any,
		);

		closeCreate();
	}

	function openStaff() {
		setShowStaff(true);
		slideUp(staffAnim);
	}
	function closeStaff() {
		slideDown(staffAnim, () => setShowStaff(false));
	}

	function handleSetViewingAs(name: string) {
		setViewingAs(name);
		closeStaff();
	}

	function toggleAssignee(name: string) {
		setSelectedAssignees((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
	}

	const getTabCount = (key: TabKey) => {
		const map: Record<TabKey, number> = {
			Todo: counts.Todo,
			"In Progress": counts.InProgress,
			Pending: counts.Pending,
			Done: counts.Done,
			Closed: counts.Closed,
		};
		return map[key];
	};

	const renderTask = useCallback(
		({ item }: { item: Task }) => (
			<TaskCard task={item} onPress={openDetail} onStart={(id) => updateStatus(id, "in-progress")} onComplete={(id) => updateStatus(id, "done")} />
		),
		[updateStatus],
	);

	// ─── Render ───────────────────────────────────────────────────────────────
	return (
		<View style={[styles.screen, { paddingTop: insets.top }]}>
			{/* Viewing As Banner */}
			{viewingAs !== CURRENT_USER.name && (
				<View style={styles.viewingBanner}>
					<View style={styles.viewingDot} />
					<Text style={styles.viewingText}>ERP VIEWING : {viewingAs.toUpperCase()}</Text>
					<TouchableOpacity onPress={() => handleSetViewingAs(CURRENT_USER.name)} style={styles.resetBtn}>
						<Text style={styles.resetBtnText}>Reset View</Text>
					</TouchableOpacity>
				</View>
			)}

		{/* Loading indicator */}
		{tasksLoading && (
			<View style={{ position: "absolute", top: insets.top + 4, right: 16, zIndex: 99 }}>
				<ActivityIndicator size="small" color="#6366f1" />
			</View>
		)}

		{/* Header */}
		<View style={styles.header}>
			<View>
				<Text style={styles.headerSub}>Enterprise ERP</Text>
				<Text style={styles.headerTitle}>Task Center</Text>
				</View>
				<View style={styles.headerRight}>
					<TouchableOpacity
						style={styles.headerIconBtn}
						onPress={() => {
							setShowSearch((v) => !v);
							if (showSearch) setSearchQuery("");
						}}>
						{showSearch ? <X size={18} color="#64748b" /> : <Search size={18} color="#64748b" />}
					</TouchableOpacity>
					<TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowNotifications(true)} activeOpacity={0.8}>
						<Bell size={18} color="#64748b" />
						{unreadCount > 0 && (
							<View style={styles.notificationBadge}>
								<Text style={styles.notificationBadgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
							</View>
						)}
					</TouchableOpacity>
					<TouchableOpacity style={[styles.profileAvatar, { backgroundColor: currentViewer.color }]} onPress={openStaff} activeOpacity={0.8}>
						<Text style={styles.profileInitials}>{currentViewer.initials}</Text>
						<View style={[styles.onlineBadge, { backgroundColor: currentViewer.status === "online" ? "#22c55e" : "#f59e0b" }]} />
					</TouchableOpacity>
				</View>
			</View>

			{/* Search Bar */}
			{showSearch && (
				<View style={styles.searchWrap}>
					<Search size={15} color="#94a3b8" style={{ marginRight: 8 }} />
					<TextInput
						style={styles.searchInput}
						placeholder="Search tasks, IDs, people..."
						placeholderTextColor="#94a3b8"
						value={searchQuery}
						onChangeText={setSearchQuery}
						autoFocus
						returnKeyType="search"
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
							<X size={14} color="#94a3b8" />
						</TouchableOpacity>
					)}
				</View>
			)}

			{/* Category Pills */}
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContent} style={styles.pillsScroll}>
				{(() => {
					// Always prioritise the current active category + Urgent when collapsed
					const counts = categoryCounts;
					const withCount = CATEGORIES.filter((cat) => (counts[cat as keyof typeof counts] ?? 0) > 0);

					if (withCount.length === 0) return null;

					// Keep a stable order when collapsed:
					// All first, Urgent second, Tester third (nếu có dữ liệu)
					let primary: string[] = withCount.filter((cat) => cat === "All" || cat === "Urgent" || cat === "Tester");

					// If current active category is another group, keep it visible too.
					if (activeCategory !== "All" && activeCategory !== "Urgent" && withCount.includes(activeCategory)) {
						primary.push(activeCategory);
					}

					// Remove duplicates and ensure the category still has count
					primary = Array.from(new Set(primary)).filter((cat) => withCount.includes(cat));

					const visibleCategories = showAllCategories ? withCount : primary;
					const others = withCount.filter((cat) => !visibleCategories.includes(cat));
					// Show the number of remaining categories (not total tasks)
					const othersCount = others.length;

					return (
						<>
							{visibleCategories.map((cat) => {
								const cfg = CATEGORY_CONFIG[cat];
								const isActive = activeCategory === cat;
								const count = counts[cat as keyof typeof counts] ?? 0;
								const { Icon } = cfg;

								return (
									<TouchableOpacity
										key={cat}
										style={[
											styles.pill,
											{ backgroundColor: cfg.bg },
											isActive && {
												borderColor: cfg.color,
												borderWidth: 2,
												shadowColor: cfg.color,
												shadowOpacity: 0.15,
												shadowRadius: 6,
												elevation: 3,
											},
										]}
										onPress={() => setActiveCategory(cat)}
										activeOpacity={0.7}>
										{Icon && <Icon size={14} color={cfg.color} />}
										<View style={{ marginLeft: 6 }}>
											<Text style={[styles.pillCount, { color: cfg.color }]}>{count}</Text>
											<Text style={[styles.pillLabel, { color: isActive ? cfg.color : "#94a3b8" }]}>
												{isActive ? cat.toUpperCase() : cat.toUpperCase()}
											</Text>
										</View>
									</TouchableOpacity>
								);
							})}

							{!showAllCategories && othersCount > 0 && (
								<TouchableOpacity
									style={[styles.pill, { backgroundColor: "#0f172a" }]}
									onPress={() => setShowAllCategories(true)}
									activeOpacity={0.8}>
									<Plus size={14} color="#e5e7eb" />
									<View style={{ marginLeft: 6 }}>
										<Text style={[styles.pillCount, { color: "#e5e7eb" }]}>{othersCount}</Text>
										<Text style={[styles.pillLabel, { color: "#9ca3af" }]}>MORE</Text>
									</View>
								</TouchableOpacity>
							)}

							{showAllCategories && (
								<TouchableOpacity
									style={[styles.pill, { backgroundColor: "#0f172a" }]}
									onPress={() => setShowAllCategories(false)}
									activeOpacity={0.8}>
									<ChevronLeft size={14} color="#e5e7eb" />
									<View style={{ marginLeft: 6 }}>
										<Text style={[styles.pillLabel, { color: "#e5e7eb" }]}>LESS</Text>
									</View>
								</TouchableOpacity>
							)}
						</>
					);
				})()}
			</ScrollView>

			{/* Task List */}
			<View style={{ flex: 1 }}>
				{filteredTasks.length === 0 ? (
					<View style={styles.emptyState}>
						<Layers size={52} color="#cbd5e1" />
						<Text style={styles.emptyTitle}>No tasks found</Text>
						<Text style={styles.emptySub}>Everything is caught up for this view.</Text>
					</View>
				) : (
					<FlashList
						key={`tasks-${activeTab}-${activeCategory}-${searchQuery}`}
						data={filteredTasks}
						extraData={`${activeTab}|${activeCategory}|${searchQuery}|${filteredTasks.length}`}
						renderItem={renderTask}
						estimatedItemSize={140}
						keyExtractor={(item) => String(item.id)}
						contentContainerStyle={styles.listContent}
						showsVerticalScrollIndicator={false}
					/>
				)}
			</View>

			{/* Bottom Navigation */}
			<BottomNav activeTab={activeTab} onTabChange={setActiveTab} counts={counts} onAdd={openCreate} bottomInset={insets.bottom} />

			{/* ── Task Detail Bottom Sheet ─────────────────────────────────── */}
			<Modal visible={showDetail} transparent animationType="fade" onRequestClose={closeDetail}>
				<View style={styles.modalWrap}>
					<Pressable style={StyleSheet.absoluteFill} onPress={closeDetail} />
					<Animated.View style={[styles.sheet, styles.detailSheet, { transform: [{ translateY: detailAnim }], paddingBottom: insets.bottom }]}>
						{selectedTask && (
							<DetailSheet
								task={selectedTask}
								onClose={closeDetail}
								onUpdate={(id, status) => {
									updateStatus(id, status);
									setSelectedTask((prev) => (prev ? withDetailDefaults({ ...prev, status }) : null));
								}}
								onFlagIssue={(id) => {
									// Web dispatches { id, status: "Issue" } (CreateTaskModal L2362)
									dispatch(masterListTasksUpdateTaskList({ id, status: "Issue" }) as any);
									updateStatus(id, "pending");
									setSelectedTask((prev) => (prev && prev.id === id ? withDetailDefaults({ ...prev, status: "pending", rawStatus: "Issue" }) : prev));
								}}
								onSaveChanges={(taskToSave) => {
									// Build payload matching web CreateTaskModal handleSubmit (L780-L803)
									const assignedId = (taskToSave.rawAssignerIds || []).length > 0
										? taskToSave.rawAssignerIds!
										: taskToSave.assignees
												.map((a) => {
													const match = assignmentPool.find(
														(p) => p.type === "person" && (p.fullName || p.firstName || p.code || "") === a.name,
													);
													return match?.id;
												})
												.filter(Boolean) as string[];
									const assignedGroupId = (taskToSave.rawGroupIds || []).length > 0
										? taskToSave.rawGroupIds!
										: (taskToSave.assignedGroup || []).map((g) => g.id).filter(Boolean);

									const effectivePriId =
										taskToSave.rawPriority ||
										(taskToSave.priority === "High" ? "Today" : taskToSave.priority || "");

									dispatch(
										masterListTasksUpdateTaskList({
											id: taskToSave.id,
											project: taskToSave.project || "",
											projectId: taskToSave.projectId || "",
											title: taskToSave.title,
											description: taskToSave.description || "",
											report: taskToSave.report || "",
											status: taskToSave.rawStatus || localStatusToApi(taskToSave.status),
											assignedId,
											assignedGroupId,
											statusOfProject: "",
											groupTodo: taskToSave.category,
											priority: effectivePriId,
											estEffort: taskToSave.estEffort ?? 0,
											priorityOfAssignter: taskToSave.priorityOfAssignter || effectivePriId,
											startDate: taskToSave.startDate || "",
											dueDate: taskToSave.dueDate || "",
											requiredImage: taskToSave.requiredImage || taskToSave.isImage ? 1 : 0,
											requiredPdf: taskToSave.requiredPdf ? 1 : 0,
											score: taskToSave.score ?? 0,
										}) as any,
									);
									Alert.alert("Saved", "Task changes have been saved.");
								}}
								panHandlers={detailPanResponder.panHandlers}
								onAddNote={(id, text) => {
									const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
									const newNote = { author: CURRENT_USER.name, text, time };
									setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, notes: [...(t.notes || []), newNote] } : t)));
									setSelectedTask((prev) =>
										prev && prev.id === id ? withDetailDefaults({ ...prev, notes: [...(prev.notes || []), newNote] }) : prev,
									);
									// Persist discussion to backend (web-compatible endpoint)
									if (!String(id).startsWith("local_")) {
										transferPostData({
											urlAPI: "/api/tasks/save-discussion",
											data: {
												id,
												content: text,
											},
										})
											.then(() => {
												dispatch(masterGetListStaffTasks() as any);
											})
											.catch((error: any) => {
												console.log("[Discussion] save error", error?.message || error);
												Alert.alert("Save failed", "Unable to save discussion to server.");
											});
									}
								}}
								onUpdatePriority={(id, priority) => {
									setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)));
									setSelectedTask((prev) => (prev && prev.id === id ? withDetailDefaults({ ...prev, priority }) : prev));
								}}
								onAddAssignee={(id, name) => {
									console.log("[Parent] onAddAssignee called", { id, name });
									const person = TEAM.find((p) => p.name === name);
									const normalizedName = name?.trim();
									if (!normalizedName) return;
									const newAssignee: Assignee = { name: person?.name || normalizedName, role: "support" };
									setTasks((prev) =>
										prev.map((t) => {
											if (t.id !== id) return t;
											const exists = (t.assignees || []).some((a) => a.name === newAssignee.name);
											const nextAssignees = exists ? (t.assignees || []) : [...(t.assignees || []), newAssignee];
											console.log("[Parent] setTasks assignees updated", {
												id,
												before: (t.assignees || []).map((a) => a.name),
												after: nextAssignees.map((a) => a.name),
												exists,
											});
											return { ...t, assignees: nextAssignees };
										}),
									);
									setSelectedTask((prev) =>
										prev && prev.id === id
											? (() => {
													const exists = (prev.assignees || []).some((a) => a.name === newAssignee.name);
													const nextAssignees = exists ? (prev.assignees || []) : [...(prev.assignees || []), newAssignee];
													console.log("[Parent] setSelectedTask assignees updated", {
														id,
														before: (prev.assignees || []).map((a) => a.name),
														after: nextAssignees.map((a) => a.name),
														exists,
													});
													return withDetailDefaults({ ...prev, assignees: nextAssignees });
											  })()
											: prev,
									);
								}}
								onAddAssignedGroup={(id, group) => {
									const normalizedGroup: AssignedGroupItem = {
										id: String(group.id || group.code || group.fullName || ""),
										code: group.code,
										fullName: group.fullName,
									};
									if (!normalizedGroup.id) return;
									setTasks((prev) =>
										prev.map((t) => {
											if (t.id !== id) return t;
											const exists = (t.assignedGroup || []).some((g) => String(g.id) === normalizedGroup.id);
											const nextGroups = exists ? (t.assignedGroup || []) : [...(t.assignedGroup || []), normalizedGroup];
											return { ...t, assignedGroup: nextGroups };
										}),
									);
									setSelectedTask((prev) =>
										prev && prev.id === id
											? withDetailDefaults({
													...prev,
													assignedGroup: (prev.assignedGroup || []).some((g) => String(g.id) === normalizedGroup.id)
														? prev.assignedGroup || []
														: [...(prev.assignedGroup || []), normalizedGroup],
											  })
											: prev,
									);
								}}
								onRemoveAssignee={(id, name) => {
									setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, assignees: (t.assignees || []).filter((a) => a.name !== name) } : t)));
									setSelectedTask((prev) =>
										prev && prev.id === id
											? withDetailDefaults({ ...prev, assignees: (prev.assignees || []).filter((a) => a.name !== name) })
											: prev,
									);
								}}
								onAddCapturedPhoto={(id, file) => {
									setTasks((prev) =>
										prev.map((t) =>
											t.id === id ? { ...t, listFiles: [...(t.listFiles || []), file] } : t,
										),
									);
									setSelectedTask((prev) =>
										prev && prev.id === id
											? withDetailDefaults({
													...prev,
													listFiles: [...(prev.listFiles || []), file],
											  })
											: prev,
									);
								}}
								assignmentPool={assignmentPool}
								priorityOptions={priorityOptions}
							/>
						)}
					</Animated.View>
				</View>
			</Modal>

			{/* ── Create Task Full Screen Modal ────────────────────────────── */}
			<Modal visible={showCreate} animationType="slide" onRequestClose={closeCreate}>
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[styles.fullScreenModal, { paddingTop: insets.top }]}>
					{/* Header */}
					<View style={styles.fullScreenHeader}>
						<View style={{ width: 32 }} />
						<Text style={styles.sheetTitle}>New Task</Text>
						<TouchableOpacity onPress={closeCreate} style={styles.closeBtn}>
							<X size={20} color="#64748b" />
						</TouchableOpacity>
					</View>

					<View style={styles.fullScreenBody}>
						<ScrollView
							showsVerticalScrollIndicator={false}
							keyboardShouldPersistTaps="handled"
							contentContainerStyle={{ padding: 20, paddingTop: 14, paddingBottom: 24 }}>
							{/* Title (required) */}
							<Text style={styles.fieldLabel}>
								TASK TITLE
								<Text style={styles.requiredMark}> *</Text>
							</Text>
							<TextInput
								style={styles.fieldInput}
								placeholder="What needs to be done?"
								placeholderTextColor="#94a3b8"
								value={newTitle}
								onChangeText={setNewTitle}
								multiline={false}
							/>

							{/* Category & Priority (Select style) */}
							<View style={[styles.fieldRow, { marginTop: 20 }]}>
								<View style={[styles.selectWrapper, { marginRight: 8 }]}>
									<Text style={styles.fieldLabel}>CATEGORY</Text>
									<TouchableOpacity style={styles.selectInput} onPress={() => setShowCategoryPicker((v) => !v)} activeOpacity={0.8}>
										<Text style={styles.selectInputValue}>{newCategory}</Text>
										<ChevronRight size={14} color="#9ca3af" style={{ transform: [{ rotate: "90deg" }] }} />
									</TouchableOpacity>
									{showCategoryPicker && (
										<View style={styles.selectOptions}>
											{CREATE_CATEGORIES.map((c) => (
												<TouchableOpacity
													key={c}
													style={styles.selectOptionItem}
													onPress={() => {
														setNewCategory(c);
														setShowCategoryPicker(false);
													}}>
													<Text style={[styles.selectOptionText, newCategory === c && { color: "#111827", fontWeight: "700" }]}>{c}</Text>
												</TouchableOpacity>
											))}
										</View>
									)}
								</View>
								<View style={styles.selectWrapper}>
									<Text style={styles.fieldLabel}>PRIORITY</Text>
									<TouchableOpacity style={styles.selectInput} onPress={() => setShowPriorityPicker((v) => !v)} activeOpacity={0.8}>
										<Text style={styles.selectInputValue}>{newPriority}</Text>
										<ChevronRight size={14} color="#9ca3af" style={{ transform: [{ rotate: "90deg" }] }} />
									</TouchableOpacity>
									{showPriorityPicker && (
										<View style={styles.selectOptions}>
											{(["Low", "Medium", "High"] as Priority[]).map((p) => (
												<TouchableOpacity
													key={p}
													style={styles.selectOptionItem}
													onPress={() => {
														setNewPriority(p);
														setShowPriorityPicker(false);
													}}>
													<Text style={[styles.selectOptionText, newPriority === p && { color: "#111827", fontWeight: "700" }]}>
														{p === "High" ? "High (Urgent)" : p}
													</Text>
												</TouchableOpacity>
											))}
										</View>
									)}
								</View>
							</View>

							{/* Assignees */}
							<Text style={[styles.fieldLabel, { marginTop: 20 }]}>ASSIGNEES</Text>
							<View style={styles.assigneeGrid}>
								{TEAM.map((m) => {
									const isSelected = selectedAssignees.includes(m.name);
									return (
										<TouchableOpacity key={m.name} style={styles.assigneeItem} onPress={() => toggleAssignee(m.name)} activeOpacity={0.7}>
											<View style={[styles.avatarMd, { backgroundColor: m.color }, isSelected && { borderWidth: 3, borderColor: "#6366f1" }]}>
												<Text style={styles.avatarMdText}>{m.initials}</Text>
												{isSelected && (
													<View style={styles.selectedBadge}>
														<Check size={9} color="#6366f1" strokeWidth={3} />
													</View>
												)}
											</View>
											<Text style={styles.assigneeItemName}>{m.name}</Text>
										</TouchableOpacity>
									);
								})}
							</View>

							{/* Photo Required */}
							<Text style={[styles.fieldLabel, { marginTop: 20 }]}>PHOTO REQUIRED</Text>
							<View style={styles.photoRow}>
								<View style={{ flex: 1, marginRight: 12 }}>
									<Text style={styles.photoTitle}>Photo Required</Text>
									<Text style={styles.photoSubtitle}>Require photo evidence to complete this task</Text>
								</View>
								<Switch
									value={newPhotoRequired}
									onValueChange={setNewPhotoRequired}
									trackColor={{ false: "#e5e7eb", true: "#4f46e5" }}
									thumbColor="#ffffff"
								/>
							</View>

							{/* Description */}
							<Text style={[styles.fieldLabel, { marginTop: 20 }]}>DESCRIPTION</Text>
							<TextInput
								style={[styles.fieldInput, { height: 120, textAlignVertical: "top", paddingTop: 14 }]}
								placeholder="Any additional notes..."
								placeholderTextColor="#94a3b8"
								value={newDesc}
								onChangeText={setNewDesc}
								multiline
							/>
						</ScrollView>

						<View style={[styles.submitBar, { paddingBottom: insets.bottom + 12 }]}>
							<TouchableOpacity
								style={[styles.submitBtn, (!newTitle.trim() || selectedAssignees.length === 0) && { opacity: 0.45 }]}
								onPress={submitTask}
								activeOpacity={0.85}>
								<Text style={styles.submitBtnText}>Create Task</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

			{/* ── Staff Switcher Bottom Sheet ──────────────────────────────── */}
			<Modal visible={showStaff} transparent animationType="fade" onRequestClose={closeStaff}>
				<View style={styles.modalWrap}>
					<Pressable style={StyleSheet.absoluteFill} onPress={closeStaff} />
					<Animated.View style={[styles.sheet, { transform: [{ translateY: staffAnim }], paddingBottom: insets.bottom + 20 }]}>
						{/* Drag handle — kéo xuống để đóng */}
						<View style={styles.dragHandleArea} {...staffPanResponder.panHandlers}>
							<View style={styles.sheetHandle} />
						</View>

						<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 24 }}>
							{TEAM.map((m) => {
								const isMe = m.name === CURRENT_USER.name;
								const userTasks = tasks.filter((t) => t.assignees.some((a) => a.name === m.name));
								const urgentCount = userTasks.filter((t) => t.priority === "High" && t.status !== "done").length;
								const isActive = viewingAs === m.name;
								return (
									<TouchableOpacity
										key={m.name}
										style={[styles.staffItem, isActive && { borderColor: m.color, borderWidth: 2 }]}
										onPress={() => handleSetViewingAs(m.name)}
										activeOpacity={0.75}>
										<View style={styles.staffLeft}>
											<View style={{ position: "relative" }}>
												<View style={[styles.avatarMd, { backgroundColor: m.color }]}>
													<Text style={styles.avatarMdText}>{m.initials}</Text>
												</View>
												<View style={[styles.staffOnlineDot, { backgroundColor: m.status === "online" ? "#22c55e" : "#f59e0b" }]} />
											</View>
											<View style={{ marginLeft: 12 }}>
												<Text style={styles.staffName}>
													{m.name}
													{isMe && <Text style={styles.staffMe}> (YOU)</Text>}
												</Text>
												<Text style={styles.staffRole}>{m.roles[0].toUpperCase()}</Text>
											</View>
										</View>
										<View style={styles.staffRight}>
											<View style={styles.staffTaskBadge}>
												<Text style={styles.staffTaskBadgeText}>{userTasks.length} Tasks</Text>
											</View>
											{urgentCount > 0 && (
												<View style={styles.staffUrgentBadge}>
													<Text style={styles.staffUrgentBadgeText}>{urgentCount} Urgent</Text>
												</View>
											)}
										</View>
									</TouchableOpacity>
								);
							})}

							<View style={{ marginTop: 8 }}>
								<TouchableOpacity
									onPress={() => {
										Alert.alert(
											"Đăng xuất",
											"Bạn có chắc chắn muốn đăng xuất?",
											[
												{ text: "Hủy", style: "cancel" },
												{
													text: "Đăng xuất",
													style: "destructive",
													onPress: () => dispatch(logoutUser(router)),
												},
											],
										);
									}}
									activeOpacity={0.85}
									style={{
										marginTop: 4,
										paddingVertical: 14,
										borderRadius: 999,
										backgroundColor: "#fee2e2",
										alignItems: "center",
										justifyContent: "center",
										borderWidth: 1,
										borderColor: "#fecaca",
									}}
								>
									<Text style={{ color: "#b91c1c", fontWeight: "700", fontSize: 14 }}>Đăng xuất</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</Animated.View>
				</View>
			</Modal>

			{/* ── Notifications Panel ──────────────────────────────────────── */}
			<Modal visible={showNotifications} transparent animationType="fade" onRequestClose={() => setShowNotifications(false)}>
				<View style={styles.notificationOverlay}>
					<Pressable style={StyleSheet.absoluteFill} onPress={() => setShowNotifications(false)} />
					<View style={styles.notificationCard}>
						<View style={styles.notificationHeader}>
							<Text style={styles.notificationTitle}>Notifications</Text>
							<TouchableOpacity onPress={() => setShowNotifications(false)} style={styles.notificationCloseBtn}>
								<X size={16} color="#64748b" />
							</TouchableOpacity>
						</View>
						<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.notificationListContent}>
							{NOTIFICATIONS.map((n) => (
								<View key={n.id} style={styles.notificationItem}>
									<View
										style={[
											styles.notificationDot,
											n.type === "task"
												? { backgroundColor: "#3b82f6" }
												: n.type === "issue"
													? { backgroundColor: "#f97316" }
													: { backgroundColor: "#22c55e" },
										]}
									/>
									<View style={{ flex: 1 }}>
										<Text style={styles.notificationItemTitle}>{n.title}</Text>
										<Text style={styles.notificationItemDesc}>{n.description}</Text>
									</View>
									<Text style={styles.notificationTime}>{n.time}</Text>
								</View>
							))}
						</ScrollView>
					</View>
				</View>
			</Modal>
		</View>
	);
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────
interface BottomNavProps {
	activeTab: TabKey;
	onTabChange: (tab: TabKey) => void;
	counts: { Todo: number; InProgress: number; Pending: number; Done: number; Closed: number };
	onAdd: () => void;
	bottomInset: number;
}

const NAV_ITEMS: { key: TabKey; label: string; Icon: React.ComponentType<any>; color: string }[] = [
	{ key: "Todo", label: "Todo", Icon: ListTodo, color: "#6366f1" },
	{ key: "In Progress", label: "In Progress", Icon: PlayCircle, color: "#3b82f6" },
	{ key: "Pending", label: "Pending", Icon: AlertCircle, color: "#f59e0b" },
	{ key: "Done", label: "Done", Icon: CheckCircle, color: "#10b981" },
	{ key: "Closed", label: "Closed", Icon: Archive, color: "#64748b" },
];

function BottomNav({ activeTab, onTabChange, counts, onAdd, bottomInset }: BottomNavProps) {
	const countMap: Record<TabKey, number> = {
		Todo: counts.Todo,
		"In Progress": counts.InProgress,
		Pending: counts.Pending,
		Done: counts.Done,
		Closed: counts.Closed,
	};

	function NavItem({ item, index }: { item: (typeof NAV_ITEMS)[number]; index: number }) {
		const isActive = activeTab === item.key;
		const count = countMap[item.key];
		const { Icon } = item;
		const isCenter = index === 2;
		return (
			<TouchableOpacity style={navStyles.navItem} onPress={() => onTabChange(item.key)} activeOpacity={0.7}>
				<View style={[navStyles.iconWrap, isActive && { transform: [{ translateY: -4 }] }, isCenter && { marginTop: 16 }]}>
					<Icon size={25} color={isActive ? item.color : "#94a3b8"} strokeWidth={isActive ? 2.5 : 2} />
					<View style={[navStyles.badge, { backgroundColor: item.color }]}>
						<Text style={navStyles.badgeText}>{ count}</Text>
					</View>
				</View>
				<Text style={[navStyles.label, { color: isActive ? item.color : "#94a3b8" }]}>{item.label.toUpperCase()}</Text>
				{isActive && <View style={[navStyles.pill, { backgroundColor: item.color }]} />}
			</TouchableOpacity>
		);
	}

	return (
		<View style={navStyles.wrapper}>
			{/* Small Add FAB above center — raised so it doesn't cover tab icons */}
			<View style={navStyles.fabWrap} pointerEvents="box-none">
				<TouchableOpacity style={navStyles.fab} onPress={onAdd} activeOpacity={0.85}>
					<Plus size={22} color="white" strokeWidth={2.5} />
				</TouchableOpacity>
			</View>

			{/* Nav Bar — all 5 tabs visible, no center spacer */}
			<View style={[navStyles.bar, { paddingBottom: bottomInset > 0 ? bottomInset : 12 }]}>
				<NavItem item={NAV_ITEMS[0]} index={0} />
				<NavItem item={NAV_ITEMS[1]} index={1} />
				<NavItem item={NAV_ITEMS[2]} index={2} />
				<NavItem item={NAV_ITEMS[3]} index={3} />
				<NavItem item={NAV_ITEMS[4]} index={4} />
			</View>
		</View>
	);
}

const navStyles = StyleSheet.create({
	wrapper: {
		position: "relative",
		zIndex: 10,
	},
	fabWrap: {
		position: "absolute",
		top: -32,
		left: 0,
		right: 0,
		alignItems: "center",
		zIndex: 20,
	},
	fab: {
		width: 55,
		height: 55,
		borderRadius: 257,
		backgroundColor: "#0f172a",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 3,
		borderColor: "white",
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.35,
		shadowRadius: 8,
		elevation: 10,
	},
	bar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderTopWidth: 1,
		borderTopColor: "#e2e8f0",
		paddingTop: 10,
		paddingHorizontal: 6,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -3 },
		shadowOpacity: 0.06,
		shadowRadius: 10,
		elevation: 12,
	},
	navItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		paddingVertical: 2,
		position: "relative",
		minWidth: 60,
	},
	iconWrap: {
		position: "relative",
		marginBottom: 4,
	},
	badge: {
		position: "absolute",
		top: -6,
		right: -12,
		paddingHorizontal: 5,
		paddingVertical: 2,
		borderRadius: 8,
		minWidth: 18,
		alignItems: "center",
		borderWidth: 2,
		borderColor: "white",
	},
	badgeText: {
		color: "white",
		fontSize: 9,
		fontWeight: "800",
		lineHeight: 11,
	},
	label: {
		fontSize: 9,
		fontWeight: "800",
		letterSpacing: 0.8,
	},
	pill: {
		position: "absolute",
		bottom: -10,
		width: 4,
		height: 4,
		borderRadius: 2,
	},
});

// ─── Detail Sheet Content ─────────────────────────────────────────────────────
function DetailSheet({
	task,
	onClose,
	onUpdate,
	onFlagIssue,
	onSaveChanges,
	panHandlers,
	onAddNote,
	onUpdatePriority,
	onAddAssignee,
	onAddAssignedGroup,
	onRemoveAssignee,
	onAddCapturedPhoto,
	assignmentPool,
	priorityOptions,
}: {
	task: Task;
	onClose: () => void;
	onUpdate: (id: string, status: TaskStatus) => void;
	onFlagIssue: (id: string) => void;
	onSaveChanges: (task: Task) => void;
	panHandlers: any;
	onAddNote: (id: string, text: string) => void;
	onUpdatePriority: (id: string, priority: Priority) => void;
	onAddAssignee: (id: string, name: string) => void;
	onAddAssignedGroup: (id: string, group: AssignedGroupItem) => void;
	onRemoveAssignee: (id: string, name: string) => void;
	onAddCapturedPhoto: (id: string, file: TaskFileItem) => void;
	assignmentPool: AssignmentPoolItem[];
	priorityOptions: Array<{ id: string; code: string; ui: Priority }>;
}) {
	const catCfg = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.Misc;
	const [newNote, setNewNote] = useState("");
	const [assigneeQuery, setAssigneeQuery] = useState("");
	const [assigneeFocused, setAssigneeFocused] = useState(false);
	const [priorityOpen, setPriorityOpen] = useState(false);
	const selectedPriorityOption: { id: string; code: string; ui: PriorityValue } = priorityOptions.find((p) => p.ui === task.priority) || {
		id: task.priority,
		code: task.priority,
		ui: task.priority,
	};
	const taskFiles = Array.isArray(task.listFiles) ? task.listFiles.filter((f) => f.type === "image/png") : [];
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
	// Match web demo: show fixed label + capture CTA only for image-required tasks
	const showCalibrationPhotoRequired = task.isImage === true;

	const selectedPersonNames = new Set((task.assignees || []).map((a) => (a.name || "").trim().toLowerCase()));
	const selectedGroupKeys = new Set(
		(task.assignedGroup || []).map((g) => String(g.id || g.code || g.fullName || "").trim().toLowerCase()),
	);
	const availableMembers = (assignmentPool || []).filter((m) => {
		const name = (m.fullName || m.firstName || m.code || "").trim().toLowerCase();
		if (m.type === "group") {
			const key = String(m.id || m.code || m.fullName || "").trim().toLowerCase();
			return key && !selectedGroupKeys.has(key);
		}
		return name && !selectedPersonNames.has(name);
	});
	const search = assigneeQuery.trim().toLowerCase();
	const filteredMembers =
		search.length === 0
			? availableMembers
			: availableMembers.filter((m) => {
					const name = (m.fullName || m.firstName || m.code || "").toLowerCase();
					const code = (m.code || "").toLowerCase();
					return name.includes(search) || code.includes(search);
			  });
	const showAssigneeDropdown = assigneeFocused && filteredMembers.length > 0;
	useEffect(() => {
		console.log("[DetailSheet] render assignees", { taskId: task.id, count: task.assignees.length, names: task.assignees.map((a) => a.name) });
	}, [task.id, task.assignees]);

	return (
		<>
			<View style={styles.dragHandleArea} {...panHandlers}>
				<View style={styles.sheetHandle} />
			</View>
			<View style={styles.detailBody}>
				{/* Fixed header: category + close (does not scroll) */}
				<View
					style={{
						paddingHorizontal: 24,
						paddingTop: 12,
						paddingBottom: 8,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						borderBottomWidth: 1,
						borderBottomColor: "#e5e7eb",
					}}>
					<Text style={{ fontSize: 11, fontWeight: "700", color: "#9ca3af", letterSpacing: 0.8 }}>
						{task.category ? task.category.toUpperCase() : "TASK"}
					</Text>
					<TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
						<X size={18} color="#94a3b8" />
					</TouchableOpacity>
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ padding: 24, paddingTop: 4, paddingBottom: 24 }}>
					{/* Title */}
					<Text style={styles.detailTitle}>{task.title}</Text>
					<View style={styles.detailMeta}>
						<View style={[styles.detailMetaItem, { flex: 1 }]}>
							<View style={styles.selectWrapper}>
								<TouchableOpacity
									style={[styles.selectInput, { paddingVertical: 8, borderRadius: 14, marginTop: 0 }]}
									onPress={() => setPriorityOpen((v) => !v)}
									activeOpacity={0.8}>
									<View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
										<View
											style={[
												styles.priorityDot,
												{
													backgroundColor: selectedPriorityOption.ui ? PRIORITY_META[selectedPriorityOption.ui as Priority]?.color || "#9ca3af" : "#9ca3af",
												},
											]}
										/>
										<Text style={styles.detailMetaText}>{selectedPriorityOption.code || "—"}</Text>
									</View>
									<ChevronRight size={14} color="#9ca3af" style={{ transform: [{ rotate: priorityOpen ? "270deg" : "90deg" }] }} />
								</TouchableOpacity>
								{priorityOpen && (
									<View style={styles.selectOptions}>
										{priorityOptions.map((p) => (
											<TouchableOpacity
												key={`${p.id}-${p.code}`}
												style={styles.selectOptionItem}
												onPress={() => {
													onUpdatePriority(task.id, p.ui);
													setPriorityOpen(false);
												}}>
												<Text style={[styles.selectOptionText, selectedPriorityOption.code === p.code && { color: "#111827", fontWeight: "700" }]}>
													{p.code}
												</Text>
											</TouchableOpacity>
										))}
									</View>
								)}
							</View>
						</View>
					<View style={[styles.detailMetaItem, { flex: 1, flexDirection: "row", alignItems: "center" }]}>
						<Calendar size={13} color="#94a3b8" />
						<Text style={[styles.detailMetaText, { marginRight: 6 }]}>{task.due !== "—" ? task.due : "No due date"}</Text>
						{(task.requiredImage || task.isImage) && (
							<View
								style={{
									marginLeft: 2,
									backgroundColor: "#fef3c7",
									paddingHorizontal: 6,
									paddingVertical: 2,
									borderRadius: 8,
								}}>
								<Text
									style={{
										fontSize: 9,
										color: "#b45309",
										fontWeight: "900",
										textTransform: "uppercase",
										letterSpacing: -0.2,
									}}>
									Photo Required
								</Text>
							</View>
						)}
					</View>
				</View>

				{/* Linked document / source */}
				{task.source && task.source !== "Manual" && (
					<View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14, paddingHorizontal: 2 }}>
						<ExternalLink size={13} color="#6366f1" />
						<Text style={{ fontSize: 12, color: "#6366f1", fontWeight: "600" }} numberOfLines={1}>
							{task.source}
						</Text>
						{task.createdBy ? (
							<Text style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>· by {task.createdBy}</Text>
						) : null}
					</View>
				)}

				{/* Team Assignment */}
					<View style={styles.detailSection}>
						<Text style={styles.detailSectionLabel}>TEAM ASSIGNMENT</Text>

						<View style={styles.teamAddContainer}>
							<View style={styles.teamAddInputWrapper}>
								<Search size={14} color="#9ca3af" />
								<TextInput
									style={styles.teamAddInput}
									placeholder="Search to assign..."
									placeholderTextColor="#9ca3af"
									value={assigneeQuery}
									onChangeText={setAssigneeQuery}
									onFocus={() => setAssigneeFocused(true)}
									onBlur={() => {
										// Keep dropdown alive briefly so item tap can fire
										setTimeout(() => setAssigneeFocused(false), 150);
									}}
								/>
							</View>
							{showAssigneeDropdown && (
								<View style={styles.teamDropdown}>
									<ScrollView keyboardShouldPersistTaps="always" style={{ maxHeight: 180 }}>
										{filteredMembers.map((m) => (
											<TouchableOpacity
												key={`${m.type}-${m.id}`}
												style={styles.teamDropdownItem}
												onPressIn={() => {
													const displayName = m.fullName || m.firstName || m.code || "";
													console.log("[DetailSheet] select assignee 123", { taskId: task.id, type: m.type, id: m.id, displayName });
													if (m.type === "group") {
														onAddAssignedGroup(task.id, {
															id: String(m.id || ""),
															code: m.code,
															fullName: m.fullName || m.firstName || m.code,
														});
													} else {
														onAddAssignee(task.id, displayName);
													}
													setAssigneeQuery("");
												}}
												onPress={() => {
													console.log("[DetailSheet] dropdown item onPress", { taskId: task.id, type: m.type, id: m.id });
												}}
												activeOpacity={0.75}>
												<View style={{ flexDirection: "row", alignItems: "center" }}>
													<View style={[styles.avatarSm, { backgroundColor: stringToColor(String(m.id || m.code || m.fullName || m.firstName || "")) }]}>
														<Text style={styles.avatarSmText}>{getInitialsFromName(m.fullName || m.firstName || m.code || "")}</Text>
													</View>
													<View style={styles.teamDropdownMeta}>
														<Text style={styles.teamDropdownName}>{m.fullName || m.firstName || m.code || "Unknown"}</Text>
														<Text style={styles.teamDropdownRole}>{m.type === "group" ? `GROUP${m.code ? ` • ${m.code}` : ""}` : m.code || "STAFF"}</Text>
													</View>
													<User size={14} color={m.type === "group" ? "#4f46e5" : "#22c55e"} />
												</View>
											</TouchableOpacity>
										))}
									</ScrollView>
								</View>
							)}
						</View>

						{/* Danh sách assignees */}
						{task.assignees.map((a, i) => {
							return (
								<View
									key={i}
									style={[styles.assigneeDetailRow, i < task.assignees.length - 1 && { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" }]}>
									<View style={[styles.avatarMd, { backgroundColor: stringToColor(a.name || "") }]}>
										<Text style={styles.avatarMdText}>{getInitialsFromName(a.name)}</Text>
									</View>
									<View style={{ flex: 1, marginLeft: 12 }}>
										<Text style={styles.assigneeDetailName}>{a.name}</Text>
										<Text style={styles.assigneeDetailRole}>{a.role.toUpperCase()}</Text>
									</View>
									{a.role === "lead" ? (
										<View style={styles.leadBadge}>
											<Text style={styles.leadBadgeText}>LEAD</Text>
										</View>
									) : (
										<TouchableOpacity
											style={styles.assigneeRemoveBtn}
											onPress={() => onRemoveAssignee(task.id, a.name)}
											hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
											<X size={14} color="#94a3b8" />
										</TouchableOpacity>
									)}
								</View>
							);
						})}
						{(task.assignedGroup || []).map((g, i) => {
							const groupName = g.fullName || g.code || "Group";
							const groupCode = (g.code || "T").substring(0, 2).toUpperCase();
							return (
								<View key={`group-${g.id || i}`} style={styles.assigneeDetailRow}>
									<View style={[styles.avatarMd, { backgroundColor: stringToColor(g.id || groupName) }]}>
										<Text style={styles.avatarMdText}>{groupCode}</Text>
									</View>
									<View style={{ flex: 1, marginLeft: 12 }}>
										<Text style={styles.assigneeDetailName}>{groupName}</Text>
										<Text style={styles.assigneeDetailRole}>GROUP</Text>
									</View>
									<View style={styles.leadBadge}>
										<Text style={styles.leadBadgeText}>TEAM</Text>
									</View>
								</View>
							);
						})}
					</View>

					{/* Discussion */}
					<View style={{ marginBottom: 16 }}>
						<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
							<Text style={styles.detailSectionLabel}>DISCUSSION</Text>
							<Text style={styles.discussionCount}>
								{task.notes.length} {task.notes.length === 1 ? "ITEM" : "ITEMS"}
							</Text>
						</View>
						{task.notes.length > 0 ? (
							task.notes.map((n, idx) => (
								<View key={idx} style={[styles.noteCard, idx > 0 && { marginTop: 8 }]}>
									<View style={styles.noteHeaderRow}>
										<Text style={styles.noteAuthor}>{n.author}</Text>
										{n.time && <Text style={styles.noteTime}>{n.time}</Text>}
									</View>
									<Text style={styles.noteText}>{n.text}</Text>
								</View>
							))
						) : (
							<View style={styles.noDiscussionBox}>
								<Text style={styles.noDiscussionText}>No discussions yet.</Text>
							</View>
						)}
						<View style={styles.discussionInputRow}>
							<TextInput
								style={styles.discussionInput}
								placeholder="Type message..."
								placeholderTextColor="#9ca3af"
								value={newNote}
								onChangeText={setNewNote}
							/>
							<TouchableOpacity
								style={[styles.discussionSendBtn, !newNote.trim() && { opacity: 0.5 }]}
								onPress={() => {
									const text = newNote.trim();
									if (!text) return;
									onAddNote(task.id, text);
									setNewNote("");
								}}
								activeOpacity={0.85}>
								<Text style={styles.discussionSendText}>Send</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Action required (match web demo style/text) – placed directly above Media evidence */}
					{showCalibrationPhotoRequired ? (
						<View style={styles.actionRequiredBox}>
							<View style={styles.actionRequiredLabelRow}>
								<Camera size={13} color="#d97706" />
								<Text style={styles.actionRequiredLabel}>Action Required: Calibration Photo</Text>
							</View>
							<TouchableOpacity
								style={styles.captureFieldBtn}
								activeOpacity={0.85}
								onPress={async () => {
									const { status } = await ImagePicker.requestCameraPermissionsAsync();
									if (status !== "granted") {
										Alert.alert("Camera permission", "Camera access is required to capture photos.");
										return;
									}
									const result = await ImagePicker.launchCameraAsync({
										mediaTypes: ImagePicker.MediaTypeOptions.Images,
										allowsEditing: false,
										quality: 0.8,
									});
									// @ts-ignore expo-image-picker older types
									if (result.canceled || !result.assets || !result.assets.length) return;
									// @ts-ignore
									const asset = result.assets[0];
									const uri: string = asset.uri;
									if (!uri) return;
									const nameFromUri = uri.split(/[\\/]/).pop() || "captured-photo.jpg";
									const file: TaskFileItem = {
										id: `local_${Date.now()}`,
										name: nameFromUri,
										url: uri,
										type: "image/png",
									};
									onAddCapturedPhoto(task.id, file);
								}}>
								<View style={styles.captureFieldBtnIconWrap}>
									<Camera size={28} color="#f59e0b" />
								</View>
								<Text style={styles.captureFieldBtnText}>Tap to Capture Field View</Text>
							</TouchableOpacity>
						</View>
					) : null}

					{/* Media evidence from real API field: listFiles */}
					{taskFiles.length > 0 ? (
						<View style={styles.detailSection}>
							{/* <Text style={styles.detailSectionLabel}>MEDIA EVIDENCE ({taskFiles.length})</Text> */}
							<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 6 }}>
								{taskFiles.map((file, idx) => {
									const fileUrl = resolveFileUrl(file.url);
									const fileName = file.name || "file";
									const isImg = isImageFile(file);
									const isPdf = isPdfFile(file);
									return (
										<TouchableOpacity
											key={file.id || `${fileName}-${idx}`}
											style={styles.fileCard}
											activeOpacity={0.85}
											onPress={() => {
												if (isImg && fileUrl) {
													setPreviewImageUrl(fileUrl);
												} else {
													openTaskFile(file).catch(() => {});
												}
											}}>
											{isImg && fileUrl ? (
												<Image source={{ uri: fileUrl }} style={styles.fileThumb} resizeMode="cover" />
											) : (
												<View style={[styles.fileThumb, styles.fileThumbFallback]}>
													<Text style={styles.fileExtText}>{isPdf ? "PDF" : "FILE"}</Text>
												</View>
											)}
											<Text style={styles.fileName} numberOfLines={1}>
												{fileName}
											</Text>
										</TouchableOpacity>
									);
								})}
							</ScrollView>
						</View>
					) : null}
				</ScrollView>

				{/* Image preview modal */}
				{previewImageUrl && (
					<Modal transparent animationType="fade" visible onRequestClose={() => setPreviewImageUrl(null)}>
						<Pressable style={styles.imagePreviewOverlay} onPress={() => setPreviewImageUrl(null)}>
							<Image source={{ uri: previewImageUrl }} style={styles.imagePreview} resizeMode="contain" />
						</Pressable>
					</Modal>
				)}

				{/* Actions fixed at bottom */}
				<View style={styles.detailActionsContainer}>
					<View style={styles.detailActions}>
						{task.status !== "done" && task.status !== "closed" ? (
							<>
								<TouchableOpacity
									style={[styles.detailActionBtn, { backgroundColor: "#16a34a" }]}
									onPress={() => onUpdate(task.id, "done")}
									activeOpacity={0.85}>
									<Check size={18} color="white" />
									<Text style={[styles.detailActionBtnText, { color: "white" }]}>Complete Task</Text>
								</TouchableOpacity>
								<View style={styles.detailActionsRow}>
									<TouchableOpacity
										style={[styles.detailActionBtnSm, { backgroundColor: "#fff7ed", borderWidth: 1.5, borderColor: "#f59e0b" }]}
										onPress={() => onFlagIssue(task.id)}>
										<Text style={[styles.detailActionBtnSmText, { color: "#d97706" }]}>Plag Issue</Text>
									</TouchableOpacity>
									<TouchableOpacity style={[styles.detailActionBtnSm, { backgroundColor: "#eef2ff" }]} onPress={() => onSaveChanges(task)}>
										<Text style={[styles.detailActionBtnSmText, { color: "#4f46e5" }]}>Save Changes</Text>
									</TouchableOpacity>
								</View>
							</>
						) : (
							<TouchableOpacity style={[styles.detailActionBtnSm, { backgroundColor: "#eef2ff" }]} onPress={() => onSaveChanges(task)}>
								<Text style={[styles.detailActionBtnSmText, { color: "#4f46e5" }]}>Save Changes</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</View>
		</>
	);
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},

	// Viewing Banner
	viewingBanner: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#0f172a",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	viewingDot: {
		width: 7,
		height: 7,
		borderRadius: 4,
		backgroundColor: "#818cf8",
		marginRight: 8,
	},
	viewingText: {
		flex: 1,
		color: "white",
		fontSize: 10,
		fontWeight: "800",
		letterSpacing: 1.5,
	},
	resetBtn: {
		backgroundColor: "rgba(255,255,255,0.12)",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 8,
	},
	resetBtnText: {
		color: "white",
		fontSize: 10,
		fontWeight: "700",
		textTransform: "uppercase",
	},

	// Header
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingTop: 14,
		paddingBottom: 10,
		backgroundColor: "rgba(248,250,252,0.92)",
	},
	headerSub: {
		fontSize: 10,
		fontWeight: "800",
		color: "#94a3b8",
		letterSpacing: 2,
		textTransform: "uppercase",
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: "800",
		color: "#0f172a",
		letterSpacing: -0.3,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	headerIconBtn: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.07,
		shadowRadius: 4,
		elevation: 2,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	profileAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2.5,
		borderColor: "white",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 4,
	},
	profileInitials: {
		color: "white",
		fontSize: 13,
		fontWeight: "800",
	},
	onlineBadge: {
		position: "absolute",
		bottom: -2,
		right: -2,
		width: 13,
		height: 13,
		borderRadius: 7,
		borderWidth: 2,
		borderColor: "white",
	},

	// Search
	searchWrap: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 20,
		marginBottom: 10,
		backgroundColor: "white",
		borderRadius: 8,
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 1,
	},
	searchInput: {
		flex: 1,
		fontSize: 14,
		color: "#1e293b",
	},

	// Category Pills
	pillsScroll: {
		flexGrow: 0,
		marginBottom: 2,
	},
	pillsContent: {
		paddingHorizontal: 20,
		paddingVertical: 8,
		gap: 8,
	},
	pill: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 8,
		borderWidth: 1.5,
		borderColor: "transparent",
	},
	pillCount: {
		fontSize: 14,
		fontWeight: "900",
		lineHeight: 16,
	},
	pillLabel: {
		fontSize: 8,
		fontWeight: "800",
		letterSpacing: 0.8,
		lineHeight: 10,
	},
	urgentBadge: {
		minWidth: 20,
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 999,
		backgroundColor: "#fee2e2",
		alignItems: "center",
		justifyContent: "center",
	},
	urgentBadgeText: {
		fontSize: 11,
		fontWeight: "800",
		color: "#b91c1c",
	},
	pillBadge: {
		minWidth: 18,
		paddingHorizontal: 7,
		paddingVertical: 1,
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
	},
	pillBadgeText: {
		fontSize: 10,
		fontWeight: "700",
	},

	// Tab Row
	tabRow: {
		flexDirection: "row",
		backgroundColor: "white",
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.04,
		shadowRadius: 3,
		elevation: 2,
	},
	tab: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		gap: 4,
		borderBottomWidth: 2.5,
		borderBottomColor: "transparent",
	},
	tabLabel: {
		fontSize: 10,
		fontWeight: "800",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	tabBadge: {
		paddingHorizontal: 5,
		paddingVertical: 2,
		borderRadius: 8,
		minWidth: 18,
		alignItems: "center",
	},
	tabBadgeText: {
		color: "white",
		fontSize: 9,
		fontWeight: "800",
	},

	// Task List
	listContent: {
		padding: 16,
		paddingBottom: 24,
	},
	taskCard: {
		backgroundColor: "white",
		borderRadius: 20,
		padding: 18,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.06,
		shadowRadius: 6,
		elevation: 2,
		borderWidth: 1,
		borderColor: "#f1f5f9",
	},
	urgentCard: {
		borderLeftWidth: 2,
		// borderLeftColor: "#ef4444",
		// shadowColor: "#ef4444",
		// shadowOpacity: 0.08,
	},
	urgentGlowBorder: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: 20,
		borderWidth: 0.8,
		borderColor: "#ef4444",
		shadowColor: "#ef4444",
		shadowOpacity: 2,
	},
	taskCardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	taskCategory: {
		fontSize: 9,
		fontWeight: "800",
		color: "#94a3b8",
		letterSpacing: 1.2,
	},
	taskDueRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	taskDue: {
		fontSize: 10,
		fontWeight: "600",
		color: "#94a3b8",
	},
	taskTitle: {
		fontSize: 15,
		fontWeight: "700",
		color: "#1e293b",
		lineHeight: 21,
		marginBottom: 14,
	},
	taskCardFooter: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	assigneeRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flexShrink: 1,
	},
	avatarGroup: {
		flexDirection: "row",
		alignItems: "center",
	},
	avatarGroupCircle: {
		width: 28,
		height: 28,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "white",
	},
	avatarSm: {
		width: 28,
		height: 28,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "white",
	},
	avatarSmText: {
		color: "white",
		fontSize: 9,
		fontWeight: "800",
	},
	assigneeName: {
		fontSize: 12,
		fontWeight: "600",
		color: "#475569",
	},
	assigneeExtra: {
		color: "#94a3b8",
		fontWeight: "500",
	},
	cardActions: {
		flexDirection: "row",
		gap: 6,
		// Khi không có assignee/assignedGroup, đẩy projectCode (hoặc nút action) sang phải
		marginLeft: "auto",
	},
	projectBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 999,
		backgroundColor: "#e5e7eb",
		maxWidth: 140,
		alignItems: "center",
		justifyContent: "center",
	},
	projectBadgeText: {
		fontSize: 10,
		fontWeight: "700",
		color: "#111827",
	},
	fileCard: {
		width: 96,
	},
	fileThumb: {
		width: 96,
		height: 96,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	fileThumbFallback: {
		backgroundColor: "#f8fafc",
		alignItems: "center",
		justifyContent: "center",
	},
	imagePreviewOverlay: {
		flex: 1,
		backgroundColor: "rgba(15,23,42,0.9)",
		justifyContent: "center",
		alignItems: "center",
	},
	imagePreview: {
		width: "90%",
		height: "80%",
		borderRadius: 12,
	},
	fileExtText: {
		fontSize: 11,
		fontWeight: "800",
		color: "#64748b",
	},
	fileName: {
		marginTop: 4,
		fontSize: 10,
		color: "#475569",
		fontWeight: "600",
	},
	actionBtn: {
		width: 32,
		height: 32,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},

	// Empty State
	emptyState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 40,
		opacity: 0.6,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#64748b",
		marginTop: 16,
	},
	emptySub: {
		fontSize: 13,
		color: "#94a3b8",
		marginTop: 6,
		textAlign: "center",
	},

	// FAB
	fab: {
		position: "absolute",
		right: 24,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#0f172a",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.35,
		shadowRadius: 12,
		elevation: 10,
	},

	// Full Screen Modal (Create Task)
	fullScreenModal: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
	fullScreenBody: {
		flex: 1,
		justifyContent: "space-between",
		backgroundColor: "#e5e7eb",
	},
	fullScreenHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 18,
		paddingVertical: 10,
		backgroundColor: "white",
		borderBottomWidth: 1,
		borderBottomColor: "#f1f5f9",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.04,
		shadowRadius: 4,
		elevation: 2,
	},
	submitBar: {
		paddingHorizontal: 24,
		paddingTop: 8,
		backgroundColor: "white",
		borderTopWidth: 1,
		borderTopColor: "#e2e8f0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.06,
		shadowRadius: 6,
		elevation: 6,
	},

	// Modal / Sheets
	modalWrap: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(15, 23, 42, 0.55)",
	},
	sheet: {
		backgroundColor: "white",
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		maxHeight: "92%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.08,
		shadowRadius: 20,
		elevation: 20,
	},
	detailSheet: {
		minHeight: "90%",
	},
	dragHandleArea: {
		width: "100%",
		alignItems: "center",
		paddingTop: 12,
		paddingBottom: 10,
	},
	sheetHandle: {
		width: 44,
		height: 5,
		borderRadius: 3,
		backgroundColor: "#e2e8f0",
		alignSelf: "center",
	},
	sheetHeaderRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#f1f5f9",
	},
	sheetTitle: {
		fontSize: 22,
		fontWeight: "800",
		color: "#0f172a",
	},
	closeBtn: {
		width: 36,
		height: 36,
		borderRadius: 8,
		backgroundColor: "#f1f5f9",
		alignItems: "center",
		justifyContent: "center",
	},

	// Category badge (in detail header)
	categoryBadge: {
		paddingHorizontal: 12,
		paddingVertical: 5,
		borderRadius: 20,
	},
	categoryBadgeText: {
		fontSize: 10,
		fontWeight: "800",
		letterSpacing: 1.5,
	},

	// Detail content
	detailTitle: {
		fontSize: 22,
		fontWeight: "800",
		color: "#0f172a",
		lineHeight: 30,
		marginBottom: 10,
	},
	detailMeta: {
		flexDirection: "row",
		gap: 20,
		marginBottom: 20,
	},
	detailMetaItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	priorityDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	detailMetaText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#64748b",
	},
	detailSection: {
		backgroundColor: "#f8fafc",
		borderRadius: 20,
		padding: 16,
		marginBottom: 16,
	},
	detailSectionLabel: {
		fontSize: 10,
		fontWeight: "800",
		color: "#94a3b8",
		letterSpacing: 1.5,
		textTransform: "uppercase",
		marginBottom: 12,
	},
	detailBody: {
		flex: 1,
		justifyContent: "space-between",
	},
	discussionCount: {
		fontSize: 10,
		fontWeight: "700",
		color: "#9ca3af",
	},
	teamAddContainer: {
		marginBottom: 4,
	},
	teamAddInputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderWidth: 1,
		borderColor: "#e5e7eb",
	},
	teamAddInput: {
		flex: 1,
		marginLeft: 6,
		fontSize: 13,
		color: "#111827",
	},
	teamDropdown: {
		marginTop: 6,
		borderRadius: 8,
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#e5e7eb",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 8,
		overflow: "hidden",
	},
	teamDropdownItem: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#f1f5f9",
	},
	teamDropdownMeta: {
		marginLeft: 10,
	},
	teamDropdownName: {
		fontSize: 14,
		fontWeight: "700",
		color: "#1e293b",
	},
	teamDropdownRole: {
		fontSize: 11,
		fontWeight: "600",
		color: "#9ca3af",
		marginTop: 2,
	},
	noDiscussionBox: {
		// paddingVertical: 16,
		// paddingHorizontal: 12,
		// borderRadius: 8,
		// backgroundColor: "#f9fafb",
		// borderWidth: 1,
		// borderColor: "#e5e7eb",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 4,
	},
	noDiscussionText: {
		fontSize: 11,
		fontStyle: "italic",
		color: "#9ca3af",
	},
	assigneeDetailRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
	},
	assigneeDetailName: {
		fontSize: 14,
		fontWeight: "700",
		color: "#1e293b",
	},
	assigneeDetailRole: {
		fontSize: 10,
		fontWeight: "700",
		color: "#94a3b8",
		letterSpacing: 1,
		marginTop: 1,
	},
	leadBadge: {
		backgroundColor: "#fef3c7",
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
	},
	leadBadgeText: {
		fontSize: 9,
		fontWeight: "800",
		color: "#d97706",
	},
	assigneeRemoveBtn: {
		width: 28,
		height: 28,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f9fafb",
	},
	noteCard: {
		backgroundColor: "#eef2ff",
		borderRadius: 8,
		padding: 14,
		borderWidth: 1,
		borderColor: "#c7d2fe",
		borderLeftWidth: 4,
		borderLeftColor: "#a5b4fc",
	},
	noteHeaderRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 4,
	},
	noteAuthor: {
		fontSize: 11,
		fontWeight: "700",
		color: "#4b5563",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	noteTime: {
		fontSize: 10,
		color: "#9ca3af",
	},
	noteText: {
		fontSize: 13,
		color: "#312e81",
		lineHeight: 20,
	},
	detailActions: {
		gap: 10,
		marginTop: 4,
	},
	detailActionsContainer: {
		paddingHorizontal: 24,
		paddingTop: 8,
		paddingBottom: 8,
		backgroundColor: "white",
		borderTopWidth: 1,
		borderTopColor: "#e5e7eb",
	},
	discussionInputRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
		gap: 8,
	},
	discussionInput: {
		flex: 1,
		backgroundColor: "#f8fafc",
		borderWidth: 1,
		borderColor: "#e5e7eb",
		borderRadius: 8,
		paddingHorizontal: 14,
		paddingVertical: 9,
		fontSize: 13,
		color: "#111827",
	},
	discussionSendBtn: {
		paddingHorizontal: 14,
		paddingVertical: 9,
		borderRadius: 8,
		backgroundColor: "#4f46e5",
	},
	discussionSendText: {
		color: "white",
		fontSize: 11,
		fontWeight: "800",
		textTransform: "uppercase",
	},
	detailActionBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		paddingVertical: 18,
		borderRadius: 8,
		shadowColor: "#16a34a",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 4,
	},
	detailActionBtnText: {
		fontSize: 15,
		fontWeight: "800",
	},
	detailActionsRow: {
		flexDirection: "row",
		gap: 10,
	},
	detailActionBtnSm: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 8,
		alignItems: "center",
	},
	detailActionBtnSmText: {
		fontSize: 13,
		fontWeight: "700",
	},

	// Create form
	fieldLabel: {
		fontSize: 10,
		fontWeight: "800",
		color: "#94a3b8",
		letterSpacing: 1.5,
		marginBottom: 8,
	},
	requiredMark: {
		color: "#ef4444",
	},
	fieldInput: {
		backgroundColor: "#f8fafc",
		borderWidth: 1,
		borderColor: "#e2e8f0",
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 15,
		color: "#1e293b",
		marginBottom: 4,
	},
	fieldRow: {
		flexDirection: "row",
		marginTop: 12,
	},
	selectChip: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: "#f1f5f9",
		borderWidth: 1.5,
		borderColor: "transparent",
	},
	selectChipActive: {
		backgroundColor: "#eef2ff",
		borderColor: "#6366f1",
	},
	selectChipText: {
		fontSize: 12,
		fontWeight: "700",
		color: "#64748b",
	},
	selectInput: {
		marginTop: 4,
		backgroundColor: "#f8fafc",
		borderWidth: 1,
		borderColor: "#e2e8f0",
		borderRadius: 8,
		paddingHorizontal: 14,
		paddingVertical: 11,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	selectWrapper: {
		flex: 1,
		position: "relative",
	},
	selectInputValue: {
		fontSize: 14,
		color: "#111827",
		fontWeight: "600",
	},
	selectOptions: {
		position: "absolute",
		top: "100%",
		left: 0,
		right: 0,
		marginTop: 4,
		borderRadius: 14,
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#e5e7eb",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 10,
		overflow: "hidden",
		zIndex: 20,
	},
	selectOptionItem: {
		paddingHorizontal: 14,
		paddingVertical: 8,
	},
	selectOptionText: {
		fontSize: 13,
		color: "#4b5563",
	},
	priorityRow: {
		flexDirection: "row",
		gap: 10,
		marginBottom: 4,
	},
	priorityChip: {
		flex: 1,
		paddingVertical: 10,
		borderRadius: 14,
		borderWidth: 2,
		alignItems: "center",
	},
	priorityChipText: {
		fontSize: 12,
		fontWeight: "800",
	},
	assigneeGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 16,
		marginBottom: 4,
	},
	assigneeItem: {
		alignItems: "center",
		gap: 5,
	},
	avatarMd: {
		width: 52,
		height: 52,
		borderRadius: 26,
		alignItems: "center",
		justifyContent: "center",
	},
	avatarMdText: {
		color: "white",
		fontSize: 14,
		fontWeight: "800",
	},
	selectedBadge: {
		position: "absolute",
		top: -2,
		right: -2,
		width: 18,
		height: 18,
		borderRadius: 9,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	assigneeItemName: {
		fontSize: 9,
		fontWeight: "800",
		color: "#64748b",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	submitBtn: {
		backgroundColor: "#6366f1",
		paddingVertical: 18,
		borderRadius: 22,
		alignItems: "center",
		marginTop: 20,
		shadowColor: "#6366f1",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 6,
	},
	notificationOverlay: {
		flex: 1,
		backgroundColor: "rgba(15,23,42,0.55)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	notificationCard: {
		width: "92%",
		height: "70%",
		backgroundColor: "white",
		borderRadius: 20,
		paddingVertical: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 10,
		elevation: 12,
	},
	notificationHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingBottom: 6,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
	},
	notificationTitle: {
		fontSize: 15,
		fontWeight: "700",
		color: "#0f172a",
	},
	notificationCloseBtn: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "#f3f4f6",
		alignItems: "center",
		justifyContent: "center",
	},
	notificationListContent: {
		paddingHorizontal: 16,
		paddingVertical: 6,
	},
	notificationItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#f1f5f9",
	},
	notificationDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginTop: 7,
		marginRight: 10,
	},
	notificationItemTitle: {
		fontSize: 13,
		fontWeight: "700",
		color: "#0f172a",
	},
	notificationItemDesc: {
		fontSize: 12,
		color: "#6b7280",
		marginTop: 2,
	},
	notificationTime: {
		fontSize: 11,
		color: "#9ca3af",
		marginLeft: 8,
		marginTop: 4,
	},
	notificationBadge: {
		position: "absolute",
		top: -4,
		right: -4,
		backgroundColor: "#ef4444",
		minWidth: 16,
		height: 16,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1.5,
		borderColor: "white",
	},
	notificationBadgeText: {
		color: "white",
		fontSize: 9,
		fontWeight: "800",
	},
	submitBtnText: {
		color: "white",
		fontSize: 16,
		fontWeight: "800",
		letterSpacing: 0.3,
	},
	photoRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: "#f9fafb",
		borderWidth: 1,
		borderColor: "#e5e7eb",
	},
	photoTitle: {
		fontSize: 14,
		fontWeight: "700",
		color: "#0f172a",
	},
	photoSubtitle: {
		fontSize: 11,
		color: "#6b7280",
		marginTop: 2,
	},
	actionRequiredBox: {
		marginBottom: 14,
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 14,
		backgroundColor: "#fffbeb",
		borderWidth: 2,
		borderStyle: "dashed",
		borderColor: "#fde68a",
	},
	actionRequiredLabelRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	actionRequiredLabel: {
		fontSize: 11,
		color: "#b45309",
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: 0.4,
	},
	captureFieldBtn: {
		marginTop: 10,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	captureFieldBtnIconWrap: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 1,
	},
	captureFieldBtnText: {
		fontSize: 14,
		fontWeight: "700",
		color: "#d97706",
	},

	// Staff switcher
	staffItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		marginBottom: 10,
		borderWidth: 1.5,
		borderColor: "#f1f5f9",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 1,
	},
	staffLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	staffOnlineDot: {
		position: "absolute",
		bottom: -1,
		right: -1,
		width: 13,
		height: 13,
		borderRadius: 7,
		borderWidth: 2,
		borderColor: "white",
	},
	staffName: {
		fontSize: 15,
		fontWeight: "700",
		color: "#1e293b",
	},
	staffMe: {
		fontSize: 10,
		fontWeight: "800",
		color: "#6366f1",
	},
	staffRole: {
		fontSize: 10,
		fontWeight: "700",
		color: "#94a3b8",
		letterSpacing: 0.8,
		marginTop: 2,
	},
	staffRight: {
		alignItems: "flex-end",
		gap: 4,
	},
	staffTaskBadge: {
		backgroundColor: "#f1f5f9",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 10,
	},
	staffTaskBadgeText: {
		fontSize: 10,
		fontWeight: "700",
		color: "#475569",
	},
	staffUrgentBadge: {
		backgroundColor: "#fef2f2",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 10,
	},
	staffUrgentBadgeText: {
		fontSize: 10,
		fontWeight: "700",
		color: "#ef4444",
	},
});
