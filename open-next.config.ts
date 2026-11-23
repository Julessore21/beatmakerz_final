import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Pas de cache incrémental : le catalogue est lu en direct sur l'API.
export default defineCloudflareConfig({});
