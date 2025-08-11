"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { trpc } from "@fsapp/trpc/client";

export default function Home() {
  const health = trpc.healthz.useQuery();
  const todos = trpc.todos.list.useQuery();
  const users = trpc.users.list.useQuery();
  const utils = trpc.useUtils();
  const [newTitle, setNewTitle] = useState("");
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
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const filteredTodos = useMemo(() => {
    const list = todos.data ?? [];
    return hideCompleted ? list.filter((t) => !t.completed) : list;
  }, [todos.data, hideCompleted]);

  const completedCount = useMemo(
    () => (todos.data ?? []).filter((t) => t.completed).length,
    [todos.data],
  );

  const totalCount = todos.data?.length ?? 0;
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-center font-mono text-sm/6 sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-mono font-semibold dark:bg-white/[.06]">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
          <li className="flex items-center gap-2">
            <span>tRPC health:</span>
            <span className="inline-flex items-center gap-2">
              <span
                className={`inline-block h-3 w-3 rounded-full ${health.isLoading
                  ? "animate-pulse bg-yellow-400"
                  : health.isError
                    ? "bg-red-500"
                    : health.data === "ok"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                aria-hidden
                title={
                  health.isLoading
                    ? "loading"
                    : health.isError
                      ? "error"
                      : (health.data ?? "unknown")
                }
              />
              <span className="sr-only">
                {health.isLoading
                  ? "loading"
                  : health.isError
                    ? "error"
                    : health.data}
              </span>
            </span>
          </li>
        </ol>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
        <section className="mt-6 w-full max-w-xl">
          <h2 className="mb-3 text-lg font-semibold">Todos</h2>
          <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-[#111]">
            {(todos.error || createTodo.error || updateTodo.error) && (
              <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                {todos.error?.message ||
                  createTodo.error?.message ||
                  updateTodo.error?.message ||
                  "Something went wrong."}
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
                placeholder="New todo title"
                className="flex-1 rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-md bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
                disabled={!newTitle.trim() || createTodo.isPending}
              >
                {createTodo.isPending ? "Adding…" : "Add"}
              </button>
            </form>
            {!todos.data && (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-white" />
              </div>
            )}
            {todos.data && (
              <div className="space-y-2">
                <div className="mb-2 flex items-center justify-between text-xs text-black/60 dark:text-white/60">
                  <span>
                    {completedCount}/{totalCount} completed
                  </span>
                  <button
                    className="rounded px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5"
                    onClick={() => setHideCompleted((v) => !v)}
                  >
                    {hideCompleted ? "Show completed" : "Hide completed"}
                  </button>
                </div>
                {filteredTodos.length === 0 ? (
                  <div className="rounded-md border border-black/10 px-3 py-6 text-center text-sm dark:border-white/15">
                    {hideCompleted
                      ? "No pending todos. Enjoy your day!"
                      : "No todos yet. Add your first one above."}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {filteredTodos.map((t) => (
                      <li
                        key={t.id}
                        className="flex items-center justify-between rounded-md bg-black/[.03] px-3 py-2 dark:bg-white/[.04]"
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <button
                            type="button"
                            className={`inline-flex size-4 rounded-sm border ${t.completed ? "border-green-600 bg-green-500" : "border-black/20 bg-transparent dark:border-white/20"}`}
                            aria-label={t.completed ? "Mark as pending" : "Mark as done"}
                            onClick={() =>
                              updateTodo.mutate({
                                id: t.id,
                                title: t.title,
                                completed: !t.completed,
                              })
                            }
                          />
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
                                className="w-full rounded-md border border-black/10 bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Escape") {
                                    setEditingTodoId(null);
                                    setEditingTitle("");
                                  }
                                }}
                              />
                              <button
                                type="submit"
                                className="rounded-md bg-black px-2 py-1 text-xs text-white disabled:opacity-50 dark:bg-white dark:text-black"
                                disabled={!editingTitle.trim() || updateTodo.isPending}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="rounded-md border border-black/10 px-2 py-1 text-xs dark:border-white/15"
                                onClick={() => {
                                  setEditingTodoId(null);
                                  setEditingTitle("");
                                }}
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <button
                              type="button"
                              className={`flex-1 text-left text-sm ${t.completed ? "text-black/40 line-through dark:text-white/40" : ""}`}
                              onClick={() => {
                                setEditingTodoId(t.id);
                                setEditingTitle(t.title);
                              }}
                              title="Click to edit"
                            >
                              {t.title}
                            </button>
                          )}
                        </div>
                        <span className="text-xs text-black/50 dark:text-white/50 pr-2">
                          {t.completed ? "Done" : "Pending"}
                        </span>
                        <button
                          type="button"
                          className="rounded-md bg-black px-2 py-1 text-xs text-white disabled:opacity-50 dark:bg-white dark:text-black"
                          onClick={() => deleteTodo.mutate({ id: t.id })}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>
        <section className="mt-6 w-full max-w-xl">
          <h2 className="mb-3 text-lg font-semibold">Users</h2>
          <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-[#111]">
            {(users.error || createUser.error) && (
              <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                {users.error?.message || createUser.error?.message || "Something went wrong."}
              </div>
            )}
            <form
              className="mb-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newName.trim() || !newEmail.trim() || createUser.isPending)
                  return;
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
                placeholder="New user name"
                className="flex-1 rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                type="email"
                placeholder="New user email"
                className="flex-1 rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-md bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
                disabled={
                  !newName.trim() || !newEmail.trim() || createUser.isPending
                }
              >
                {createUser.isPending ? "Adding…" : "Add"}
              </button>
            </form>
            {!users.data && (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-white" />
              </div>
            )}
            {users.data && (
              <>
                {users.data.length === 0 ? (
                  <div className="rounded-md border border-black/10 px-3 py-6 text-center text-sm dark:border-white/15">
                    No users yet. Add one above.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {users.data.map((u) => (
                      <li
                        key={u.id}
                        className="flex items-center justify-between rounded-md bg-black/[.03] px-3 py-2 dark:bg-white/[.04]"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-sm`}>{u.name}</span>
                        </div>
                        <span className="text-xs text-black/50 dark:text-white/50">
                          {u.email}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
