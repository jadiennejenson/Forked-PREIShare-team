import { __toESM } from "../_runtime.mjs";
import { require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/share-Br6RuX5C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DATABASE_NAME = "preishare";
var STORE_NAME = "files";
function openFileDatabase() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DATABASE_NAME, 1);
		request.onupgradeneeded = () => {
			request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
async function getSavedFiles() {
	const database = await openFileDatabase();
	return new Promise((resolve, reject) => {
		const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
		request.onsuccess = () => {
			database.close();
			resolve(request.result.sort((first, second) => new Date(second.savedAt).getTime() - new Date(first.savedAt).getTime()));
		};
		request.onerror = () => {
			database.close();
			reject(request.error);
		};
	});
}
async function saveFile(file) {
	const database = await openFileDatabase();
	const savedFile = {
		id: crypto.randomUUID(),
		name: file.name,
		size: file.size,
		type: file.type,
		savedAt: (/* @__PURE__ */ new Date()).toISOString(),
		file
	};
	return new Promise((resolve, reject) => {
		const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).add(savedFile);
		request.onsuccess = () => {
			database.close();
			resolve(savedFile);
		};
		request.onerror = () => {
			database.close();
			reject(request.error);
		};
	});
}
async function removeFile(id) {
	const database = await openFileDatabase();
	return new Promise((resolve, reject) => {
		const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
		request.onsuccess = () => {
			database.close();
			resolve();
		};
		request.onerror = () => {
			database.close();
			reject(request.error);
		};
	});
}
async function downloadFile(id) {
	const database = await openFileDatabase();
	return new Promise((resolve, reject) => {
		const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
		request.onsuccess = () => {
			database.close();
			const storedFile = request.result;
			if (!storedFile) {
				reject(/* @__PURE__ */ new Error("File not found"));
				return;
			}
			const url = URL.createObjectURL(storedFile.file);
			const link = document.createElement("a");
			link.href = url;
			link.download = storedFile.name;
			link.click();
			URL.revokeObjectURL(url);
			resolve();
		};
		request.onerror = () => {
			database.close();
			reject(request.error);
		};
	});
}
function Share() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-wrap px-4 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "island-shell rounded-2xl p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "island-kicker mb-2",
					children: "Share"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl",
					children: "Share a file with others."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]",
					children: "Use this page to share a file with others. You can upload a file and save it in this browser, download it later, or copy a link for this page."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareWorkspace, {})]
	});
}
function ShareWorkspace() {
	const [files, setFiles] = (0, import_react.useState)([]);
	const [message, setMessage] = (0, import_react.useState)("");
	const [isBusy, setIsBusy] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		getSavedFiles().then(setFiles).catch(() => setMessage("Your browser could not open local file storage.")).finally(() => setIsBusy(false));
	}, []);
	async function handleFileSelected(event) {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;
		setIsBusy(true);
		setMessage("");
		try {
			const savedFile = await saveFile(file);
			setFiles((currentFiles) => [savedFile, ...currentFiles]);
			setMessage(`${file.name} was saved in this browser.`);
		} catch {
			setMessage("This file could not be saved. It may be too large for browser storage.");
		} finally {
			setIsBusy(false);
		}
	}
	async function handleDelete(id) {
		await removeFile(id);
		setFiles((currentFiles) => currentFiles.filter((file) => file.id !== id));
		setMessage("File removed from this browser.");
	}
	async function handleCopyLink(id) {
		const link = `${window.location.origin}/share?file=${encodeURIComponent(id)}`;
		await navigator.clipboard.writeText(link);
		setMessage("Link copied. It works anywhere this browser has the saved file.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "island-shell mt-8 rounded-2xl p-6 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-between gap-5 sm:flex-row sm:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "island-kicker mb-2",
					children: "Your files"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "display-title m-0 text-3xl font-bold text-[var(--sea-ink)]",
					children: "Keep a private local copy."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--lagoon-deep)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:brightness-105",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBusy ? "Saving..." : "Choose a file" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						className: "sr-only",
						onChange: handleFileSelected,
						disabled: isBusy
					})]
				})]
			}),
			message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-4 py-3 text-sm text-[var(--sea-ink-soft)]",
				children: message
			}),
			files.length === 0 && !isBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl border border-dashed border-[var(--line)] px-5 py-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "m-0 font-semibold text-[var(--sea-ink)]",
					children: "No files saved yet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 mb-0 text-sm text-[var(--sea-ink-soft)]",
					children: "Choose a file to save it securely in this browser."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3",
				children: files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "feature-card flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "m-0 truncate font-bold text-[var(--sea-ink)]",
							children: file.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "m-0 mt-1 text-sm text-[var(--sea-ink-soft)]",
							children: [
								formatBytes(file.size),
								" · Saved ",
								formatDate(file.savedAt)
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 text-sm font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-full border border-[var(--line)] px-4 py-2 text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]",
								onClick: () => void downloadFile(file.id),
								children: "Download"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-full border border-[var(--line)] px-4 py-2 text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]",
								onClick: () => void handleCopyLink(file.id),
								children: "Copy link"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-full px-4 py-2 text-[var(--lagoon-deep)] transition hover:bg-[var(--link-bg-hover)]",
								onClick: () => void handleDelete(file.id),
								children: "Delete"
							})
						]
					})]
				}, file.id))
			})
		]
	});
}
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatDate(date) {
	return new Intl.DateTimeFormat(void 0, { dateStyle: "medium" }).format(new Date(date));
}
//#endregion
export { Share as component };
