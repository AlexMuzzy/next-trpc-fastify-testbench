"use client";
import { useMemo, useState } from "react";
import { trpc } from "@fsapp/trpc/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  ComposedChart,
} from "recharts";
import {
  CheckCircle,
  Users,
  TrendingUp,
  Activity,
  Plus,
  Trash2,
  UserPlus,
  Target,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Users as UsersIcon,
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

export default function Dashboard() {
  const health = trpc.healthz.useQuery();
  const todos = trpc.todos.list.useQuery();
  const users = trpc.users.list.useQuery();
  const utils = trpc.useUtils();

  // State for todo management
  const [newTitle, setNewTitle] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // State for user management
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // State for visualization tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'distribution' | 'users'>('overview');

  // Mutations
  const createTodo = trpc.todos.create.useMutation({
    onSuccess: async () => {
      setNewTitle("");
      await utils.todos.list.invalidate();
    },
  });

  const updateTodo = trpc.todos.update.useMutation({
    onSuccess: async () => {
      await utils.todos.list.invalidate();
    },
  });

  const deleteTodo = trpc.todos.delete.useMutation({
    onSuccess: async () => {
      await utils.todos.list.invalidate();
    },
  });

  const createUser = trpc.users.create.useMutation({
    onSuccess: async () => {
      await utils.users.list.invalidate();
    },
  });

  // Computed data for visualizations
  const dashboardData = useMemo(() => {
    const todosList = todos.data ?? [];
    const usersList = users.data ?? [];

    // Todo completion stats
    const completedCount = todosList.filter(t => t.completed).length;
    const pendingCount = todosList.length - completedCount;
    const completionRate = todosList.length > 0 ? (completedCount / todosList.length) * 100 : 0;

    // Recent activity (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, 'MMM dd'),
        fullDate: date,
        todos: 0,
        completed: 0,
      };
    }).reverse();

    // Populate recent activity data
    todosList.forEach(todo => {
      const todoDate = new Date(todo.createdAt);
      const dayIndex = last7Days.findIndex(day =>
        todoDate >= startOfDay(day.fullDate) && todoDate <= endOfDay(day.fullDate)
      );
      if (dayIndex !== -1) {
        last7Days[dayIndex].todos++;
        if (todo.completed) {
          last7Days[dayIndex].completed++;
        }
      }
    });

    // Todo length distribution
    const todoLengths = todosList.map(todo => ({
      length: todo.title.length,
      category: todo.title.length <= 20 ? 'Short' :
        todo.title.length <= 50 ? 'Medium' : 'Long',
      completed: todo.completed
    }));

    const lengthDistribution = [
      { name: 'Short (≤20)', value: todoLengths.filter(t => t.category === 'Short').length, color: '#82ca9d' },
      { name: 'Medium (21-50)', value: todoLengths.filter(t => t.category === 'Medium').length, color: '#8884d8' },
      { name: 'Long (>50)', value: todoLengths.filter(t => t.category === 'Long').length, color: '#ffc658' },
    ];

    // User activity (todos per user - simulated since no user-todo relationship)
    const userActivity = usersList.map((user, index) => ({
      name: user.name,
      todos: Math.floor(Math.random() * 10) + 1, // Simulated data
      completed: Math.floor(Math.random() * 5) + 1,
    }));

    return {
      completionRate,
      completedCount,
      pendingCount,
      totalTodos: todosList.length,
      totalUsers: usersList.length,
      last7Days,
      lengthDistribution,
      userActivity,
      todosList,
      usersList,
    };
  }, [todos.data, users.data]);

  const filteredTodos = useMemo(() => {
    const list = todos.data ?? [];
    return hideCompleted ? list.filter((t) => !t.completed) : list;
  }, [todos.data, hideCompleted]);

  if (todos.isLoading || users.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderVisualization = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardData.totalTodos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardData.completedCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardData.pendingCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardData.completionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={dashboardData.last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="todos" fill="#3b82f6" name="New Tasks" />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} name="Completed" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity Timeline</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={dashboardData.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="todos" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" name="New Tasks" />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} name="Completed" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );

      case 'distribution':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Length Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={dashboardData.lengthDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.lengthDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'users':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Activity Overview</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dashboardData.userActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Legend />
                <Bar dataKey="todos" fill="#3b82f6" name="Total Tasks" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Analytics Dashboard</h1>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${health.isLoading ? 'bg-yellow-400 animate-pulse' : health.isError ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {health.isLoading ? 'Connecting...' : health.isError ? 'Offline' : 'Online'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {dashboardData.totalUsers} Users
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {dashboardData.totalTodos} Total Tasks
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Todo Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Management</h3>
                <button
                  onClick={() => setHideCompleted(!hideCompleted)}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {hideCompleted ? "Show Completed" : "Hide Completed"}
                </button>
              </div>

              {(todos.error || createTodo.error || updateTodo.error) && (
                <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                  {todos.error?.message || createTodo.error?.message || updateTodo.error?.message || "Something went wrong."}
                </div>
              )}

              <form
                className="mb-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTitle.trim() || createTodo.isPending) return;
                  createTodo.mutate({ title: newTitle.trim() });
                }}
              >
                <input
                  type="text"
                  placeholder="New task title"
                  className="flex-1 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                  disabled={!newTitle.trim() || createTodo.isPending}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredTodos.length === 0 ? (
                  <div className="rounded-md border border-gray-200 px-3 py-4 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                    {hideCompleted ? "No pending tasks. Great job!" : "No tasks yet. Add your first one above."}
                  </div>
                ) : (
                  filteredTodos.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-700"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <button
                          type="button"
                          className={`inline-flex size-4 rounded-sm border ${t.completed ? "border-green-600 bg-green-500" : "border-gray-300 bg-transparent dark:border-gray-600"}`}
                          onClick={() =>
                            updateTodo.mutate({
                              id: t.id,
                              title: t.title,
                              completed: !t.completed,
                            })
                          }
                        >
                          {t.completed && <CheckCircle className="h-3 w-3 text-white" />}
                        </button>

                        {editingTodoId === t.id ? (
                          <form
                            className="flex w-full items-center gap-2"
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!editingTitle.trim()) return;
                              updateTodo.mutate({
                                id: t.id,
                                title: editingTitle.trim(),
                                completed: t.completed,
                              });
                              setEditingTodoId(null);
                              setEditingTitle("");
                            }}
                          >
                            <input
                              autoFocus
                              className="w-full rounded-md border border-gray-300 bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                            />
                            <button
                              type="submit"
                              className="rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                            >
                              Save
                            </button>
                          </form>
                        ) : (
                          <button
                            type="button"
                            className={`flex-1 text-left text-sm ${t.completed ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"}`}
                            onClick={() => {
                              setEditingTodoId(t.id);
                              setEditingTitle(t.title);
                            }}
                          >
                            {t.title}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded-md bg-red-600 p-1 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                          onClick={() => deleteTodo.mutate({ id: t.id })}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* User Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
                <Users className="h-5 w-5 text-gray-400" />
              </div>

              {(users.error || createUser.error) && (
                <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                  {users.error?.message || createUser.error?.message || "Something went wrong."}
                </div>
              )}

              <form
                className="mb-4 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newName.trim() || !newEmail.trim() || createUser.isPending) return;
                  createUser.mutate({
                    name: newName.trim(),
                    email: newEmail.trim(),
                  });
                  setNewName("");
                  setNewEmail("");
                }}
              >
                <input
                  type="text"
                  placeholder="User name"
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="User email"
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                  disabled={!newName.trim() || !newEmail.trim() || createUser.isPending}
                >
                  <UserPlus className="h-4 w-4 inline mr-2" />
                  Add User
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dashboardData.usersList.length === 0 ? (
                  <div className="rounded-md border border-gray-200 px-3 py-4 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                    No users yet. Add one above.
                  </div>
                ) : (
                  dashboardData.usersList.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Visualization Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 dark:bg-gray-700">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'activity'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Activity</span>
                </button>
                <button
                  onClick={() => setActiveTab('distribution')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'distribution'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                  <PieChartIcon className="h-4 w-4" />
                  <span>Distribution</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'users'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                  <UsersIcon className="h-4 w-4" />
                  <span>Users</span>
                </button>
              </div>
            </div>

            {/* Visualization Content */}
            {renderVisualization()}
          </div>
        </div>
      </div>
    </div>
  );
}
