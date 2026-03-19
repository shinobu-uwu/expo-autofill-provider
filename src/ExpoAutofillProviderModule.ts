import { NativeModule, requireNativeModule } from 'expo';

import { ExpoAutofillProviderModuleEvents } from './ExpoAutofillProvider.types';

declare class ExpoAutofillProviderModule extends NativeModule<ExpoAutofillProviderModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoAutofillProviderModule>('ExpoAutofillProvider');
