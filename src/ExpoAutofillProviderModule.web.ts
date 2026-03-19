import { registerWebModule, NativeModule } from 'expo';

import { ExpoAutofillProviderModuleEvents } from './ExpoAutofillProvider.types';

class ExpoAutofillProviderModule extends NativeModule<ExpoAutofillProviderModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoAutofillProviderModule, 'ExpoAutofillProviderModule');
