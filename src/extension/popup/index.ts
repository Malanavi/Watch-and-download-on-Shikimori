type StorageShape = {
    currentDomain?: string;
};

type DomainSelectedMessage = {
    type: "DOMAIN_SELECTED";
    origin: string;
};

const STORAGE_KEY = "currentDomain";

const input = document.getElementById("domain") as HTMLInputElement | null;
const form = document.getElementById("domainForm") as HTMLFormElement | null;

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!input) return;

    try {
        const raw = input.value.trim();
        const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
        const url = new URL(normalized);

        const origin = url.origin;
        const pattern = `${origin}/*`;

        const granted = await chrome.permissions.request({
            origins: [pattern]
        });

        if (!granted) return;

        await chrome.storage.sync.set({ [STORAGE_KEY]: origin });

        const message: DomainSelectedMessage = {
            type: "DOMAIN_SELECTED",
            origin
        };

        await chrome.runtime.sendMessage(message);

        window.close();

    } catch {
        alert("Invalid URL");
    }
});

chrome.storage.sync.get(STORAGE_KEY)
    .then((data) => {
        const { currentDomain } = data as StorageShape;
        if (!input || !currentDomain) return;
        input.value = currentDomain;
    });

export { };