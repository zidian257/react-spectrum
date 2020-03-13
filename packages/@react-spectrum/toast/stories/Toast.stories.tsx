/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {action} from '@storybook/addon-actions';
import {Button} from '@react-spectrum/button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {Toast} from '../src/Toast';
import {ToastProps} from '@react-types/toast';
import {useToastProvider} from '../';

storiesOf('Toast', module)
  .add(
    'action triggers close',
    () => <RenderActionProvider />
  ).add(
    'add via provider',
    () => <RenderProvider />
  ).add(
    'add via provider with timers',
    () => <RenderProviderTimers />
  );

function RenderActionProvider() {
  let toastContext = useToastProvider();
  return (
    <>
      <Button
        onPress={() => toastContext.negative('Toast was burnt', {actionLabel: 'Undo', onAction: action('onAction'), onClose: action('onClose')})}
        variant="negative">
          Show actionable Toast
      </Button>
      <Button
        onPress={() => toastContext.negative('Toasting happened', {shouldCloseOnAction: true, actionLabel: 'Confirm', onAction: action('onAction'), onClose: action('onClose')})}
        variant="negative">
          Show close on action Toast
      </Button>
    </>
  );
}

function RenderProvider() {
  let toastContext = useToastProvider();

  return (
    <div>
      <Button
        onPress={() => toastContext.neutral('Toast is default', {onClose: action('onClose'), timeout: 7000})}
        variant="secondary">
          Show Default Toast
      </Button>
      <Button
        onPress={() => toastContext.positive('Toast is positive', {onClose: action('onClose'), timeout: 9000})}
        variant="primary">
          Show Primary Toast
      </Button>
      <Button
        onPress={() => toastContext.negative('Toast is negative', {onClose: action('onClose'), timeout: 10000})}
        variant="negative">
          Show Negative Toast
      </Button>
      <Button
        onPress={() => toastContext.info('Toast is info', {onClose: action('onClose')})}
        variant="cta">
          Show info Toast
      </Button>
    </div>
  );
}

function RenderProviderTimers() {
  let toastContext = useToastProvider();

  return (
    <div>
      <Button
        onPress={() => toastContext.neutral('Toast defaults to 5 second timeout', {onClose: action('onClose')})}
        variant="secondary">
          Show Default Toast
      </Button>
      <Button
        onPress={() => toastContext.neutral('Actionable Toast defaults to no timeout', {onClose: action('onClose'), onAction: action('onAction'), shouldCloseOnAction: true, actionLabel: 'no timeout'})}
        variant="secondary">
          Show Actionable Toast
      </Button>
      <Button
        onPress={() => toastContext.neutral('Toast has a 7 second timeout', {onClose: action('onClose'), timeout: 7000})}
        variant="secondary">
          Show 7 Second Timeout Toast
      </Button>
      <Button
        onPress={() => toastContext.neutral('Toast with "timeout=0" has no timeout', {onClose: action('onClose'), timeout: 0})}
        variant="secondary">
          Show No Timeout Toast
      </Button>
    </div>
  );
}
