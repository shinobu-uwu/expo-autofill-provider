// Reexport the native module. On web, it will be resolved to ExpoAutofillProviderModule.web.ts
// and on native platforms to ExpoAutofillProviderModule.ts
export * from './ExpoAutofillProvider.types';
export { default } from './ExpoAutofillProviderModule';
