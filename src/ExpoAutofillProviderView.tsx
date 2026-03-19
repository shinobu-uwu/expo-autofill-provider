import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoAutofillProviderViewProps } from './ExpoAutofillProvider.types';

const NativeView: React.ComponentType<ExpoAutofillProviderViewProps> =
  requireNativeView('ExpoAutofillProvider');

export default function ExpoAutofillProviderView(props: ExpoAutofillProviderViewProps) {
  return <NativeView {...props} />;
}
