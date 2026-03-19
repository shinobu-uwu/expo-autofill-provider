// Reexport the native module. On web, it will be resolved to ExpoAutofillProviderModule.web.ts
// and on native platforms to ExpoAutofillProviderModule.ts
export { default } from './ExpoAutofillProviderModule';
export { default as ExpoAutofillProviderView } from './ExpoAutofillProviderView';
export * from  './ExpoAutofillProvider.types';
