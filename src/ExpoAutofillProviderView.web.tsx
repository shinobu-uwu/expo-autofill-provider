import * as React from 'react';

import { ExpoAutofillProviderViewProps } from './ExpoAutofillProvider.types';

export default function ExpoAutofillProviderView(props: ExpoAutofillProviderViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
