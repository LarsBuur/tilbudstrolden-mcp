// Library entry point. Importing it builds nothing and starts no transport;
// the stdio server lives in server.ts and runs through the package's bin.

export { type CreateServerOptions, createServer, SERVER_INSTRUCTIONS } from "./create-server.js";
export {
  type DataStore,
  fileStorage,
  type Household,
  type Ingredient,
  type MealLogEntry,
  type Person,
  type Recipe,
  type SpendLogEntry,
  type StorageBackend,
  type StorePreference,
  setStorageBackend,
} from "./store.js";
export { SERVER_VERSION } from "./version.js";
