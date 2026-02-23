type StorageShape = {
    currentDomain?: string;
};

type DomainSelectedMessage = {
    type: "DOMAIN_SELECTED";
    origin: string;
};

const SCRIPT_ID = "dynamic-shikimori";
const STORAGE_KEY = "currentDomain";

let currentRegisteredOrigin: string | null = null;

function patternFromOrigin(origin: string): string {
    return `${origin}/*`;
}

function originFromPattern(pattern: string): string {
    return pattern.endsWith("/*")
        ? pattern.slice(0, -2)
        : pattern;
}

async function hasPermission(origin: string): Promise<boolean> {
    return chrome.permissions.contains({
        origins: [patternFromOrigin(origin)]
    });
}

async function register(origin: string): Promise<void> {
    if (currentRegisteredOrigin === origin) return;

    const pattern = patternFromOrigin(origin);

    await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] }).catch(() => { });

    await chrome.scripting.registerContentScripts([{
        id: SCRIPT_ID,
        matches: [pattern],
        js: ["content.js"],
        runAt: "document_end"
    }]);

    currentRegisteredOrigin = origin;
}

async function injectIntoExistingTabs(origin: string): Promise<void> {
    const pattern = patternFromOrigin(origin);
    const tabs = await chrome.tabs.query({ url: pattern });

    for (const tab of tabs) {
        if (!tab.id) continue;

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        }).catch(() => { });
    }
}

async function ensureRegisteredAndInjected(origin: string): Promise<void> {
    if (!(await hasPermission(origin))) return;

    await register(origin);
    await injectIntoExistingTabs(origin);
}

async function restore(): Promise<void> {
    const data = await chrome.storage.sync.get(STORAGE_KEY) as StorageShape;
    if (!data.currentDomain) return;

    currentRegisteredOrigin = data.currentDomain;

    await ensureRegisteredAndInjected(data.currentDomain);
}

chrome.runtime.onInstalled.addListener(restore);
chrome.runtime.onStartup.addListener(restore);

chrome.permissions.onAdded.addListener(async (permissions) => {
    if (!permissions.origins) return;

    for (const pattern of permissions.origins) {
        const origin = originFromPattern(pattern);

        await chrome.storage.sync.set({ [STORAGE_KEY]: origin });

        currentRegisteredOrigin = origin;

        await ensureRegisteredAndInjected(origin);
    }
});

chrome.runtime.onMessage.addListener(async (msg: unknown) => {
    const message = msg as DomainSelectedMessage;

    if (message?.type !== "DOMAIN_SELECTED") return;

    const origin = message.origin;

    currentRegisteredOrigin = origin;

    await ensureRegisteredAndInjected(origin);
});

export { };