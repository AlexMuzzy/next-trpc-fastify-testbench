"use client";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "@fsapp/trpc/client";

export default function Home() {
  const health = trpc.healthz.useQuery();
  const todos = trpc.todos.list.useQuery();
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
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
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
                  ? "bg-yellow-400 animate-pulse"
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
                      : health.data ?? "unknown"
                }
              />
              <span className="sr-only">
                {health.isLoading ? "loading" : health.isError ? "error" : health.data}
              </span>
            </span>
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
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
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
        <section className="w-full max-w-xl mt-6">
          <h2 className="text-lg font-semibold mb-3">Todos</h2>
          <div className="rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-[#111] p-4">
            <form
              className="flex gap-2 mb-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTitle.trim() || createTodo.isPending) return;
                createTodo.mutate({ title: newTitle.trim() });
              }}
            >
              <input
                type="text"
                placeholder="New todo title"
                className="flex-1 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-2 text-sm disabled:opacity-50"
                disabled={!newTitle.trim() || createTodo.isPending}
              >
                {createTodo.isPending ? "Adding…" : "Add"}
              </button>
            </form>
            {!todos.data && <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white" />
            </div>}
            {todos.data && (
              <ul className="space-y-2">
                {todos.data.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between rounded-md px-3 py-2 bg-black/[.03] dark:bg-white/[.04]"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex size-4 rounded-sm border ${t.completed ? "bg-green-500 border-green-600" : "bg-transparent border-black/20 dark:border-white/20"}`}
                        aria-hidden
                        onClick={() => updateTodo.mutate({ id: t.id, title: t.title, completed: !t.completed })}
                      />
                      <span className={`text-sm ${t.completed ? "line-through text-black/40 dark:text-white/40" : ""}`}>
                        {t.title}
                      </span>
                    </div>
                    <span className="text-xs text-black/50 dark:text-white/50">
                      {t.completed ? "Done" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
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
