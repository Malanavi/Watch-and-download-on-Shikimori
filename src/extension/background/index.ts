type StorageShape = {
    currentDomain?: string;
};

type DomainSelectedMessage = {
    type: "DOMAIN_SELECTED";
    origin: string;
};

const SCRIPT_ID = "dynamic-shikimori";
const STORAGE_KEY = "currentDomain";

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
    const pattern = patternFromOrigin(origin);

    const existing = await chrome.scripting.getRegisteredContentScripts();

    const existingScript = existing.find(s => s.id === SCRIPT_ID);

    if (
        existingScript &&
        existingScript.matches?.length === 1 &&
        existingScript.matches[0] === pattern
    ) {
        return;
    }

    await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] }).catch(() => { });

    await chrome.scripting.registerContentScripts([{
        id: SCRIPT_ID,
        matches: [pattern],
        js: ["content.js"],
        runAt: "document_end"
    }]);
}

async function injectIntoExistingTabs(origin: string): Promise<void> {
    const pattern = patternFromOrigin(origin);
    const tabs = await chrome.tabs.query({ url: pattern });

    const injectables = tabs.filter(
        tab =>
            tab.id &&
            tab.url &&
            tab.status !== "unloaded" &&
            !tab.url.startsWith("chrome://") &&
            !tab.url.startsWith("about:")
    );

    await Promise.all(
        injectables.map(tab =>
            chrome.scripting.executeScript({
                target: { tabId: tab.id! },
                files: ["content.js"]
            }).catch(() => { })
        )
    );
}

async function ensureRegisteredAndInjected(origin: string): Promise<void> {
    if (!(await hasPermission(origin))) return;

    await register(origin);
    await injectIntoExistingTabs(origin);
}

async function restore(): Promise<void> {
    const data = await chrome.storage.sync.get(STORAGE_KEY) as StorageShape;
    if (!data.currentDomain) return;

    await ensureRegisteredAndInjected(data.currentDomain);
}

chrome.runtime.onInstalled.addListener(restore);
chrome.runtime.onStartup.addListener(restore);

chrome.permissions.onAdded.addListener(async (permissions) => {
    if (!permissions.origins) return;

    for (const pattern of permissions.origins) {
        const origin = originFromPattern(pattern);

        await chrome.storage.sync.set({ [STORAGE_KEY]: origin });

        await ensureRegisteredAndInjected(origin);
    }
});

chrome.runtime.onMessage.addListener(async (msg: unknown) => {
    const message = msg as DomainSelectedMessage;

    if (message?.type !== "DOMAIN_SELECTED") return;

    const origin = message.origin;

    await ensureRegisteredAndInjected(origin);
});

export { };