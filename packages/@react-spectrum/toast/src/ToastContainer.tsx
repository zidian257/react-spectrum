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

import {classNames, filterDOMProps} from '@react-spectrum/utils';
import React, {ReactElement, ReactNode} from 'react';
import {Toast} from './Toast';
import toastContainerStyles from './toastContainer.css';
import {ToastOptions} from '@react-types/toast';
import {useProvider} from '@react-spectrum/provider';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CSSTransition from 'react-transition-group/CSSTransition';

interface ToastStateProps extends ToastOptions{
  variant?: 'positive' | 'negative' | 'info',
  id?: string
}

type Timer = {
  resume: () => void,
  pause: () => void,
  clear: () => void
}

interface ToastStateValue {
  content: ReactNode,
  props: ToastStateProps,
  timer: Timer
}

interface SpectrumToastContainerProps {
  toasts?: ToastStateValue[]
}

export function ToastContainer(props: SpectrumToastContainerProps): ReactElement {
  let {
    toasts
  } = props;
  let providerProps = useProvider();

  let toastPlacement = providerProps && providerProps.toastPlacement && providerProps.toastPlacement.split(' ');
  let containerPosition = toastPlacement && toastPlacement[0];
  let containerPlacement = toastPlacement && toastPlacement[1];

  let classes = {
    appear: classNames(toastContainerStyles, `react-spectrum-Toast-slide-${containerPosition}-appear`),
    appearActive: classNames(toastContainerStyles, `react-spectrum-Toast-slide-${containerPosition}-appear-active`),
    enter: classNames(toastContainerStyles,`react-spectrum-Toast-slide-${containerPosition}-enter`),
    enterActive: classNames(toastContainerStyles, `react-spectrum-Toast-slide-${containerPosition}-enter-active`),
    exit: classNames(toastContainerStyles, `react-spectrum-Toast-slide-${containerPosition}-exit`),
    exitActive: classNames(toastContainerStyles, `react-spectrum-Toast-slide-${containerPosition}-exit-active`),
  };

  console.log("containter otasts", toasts)
  if (!toasts || toasts.length === 0) {
    return null;
  }

  console.log("timers in render", toasts)
  return (

      <TransitionGroup
        className={classNames(
          toastContainerStyles,
          'react-spectrum-ToastContainer',
          containerPosition && `react-spectrum-ToastContainer--${containerPosition}`,
          containerPlacement && `react-spectrum-ToastContainer--${containerPlacement}`
        )}>
        <CSSTransition key={toasts[0].props.toastKey} classNames={classes} timeout={200}>
          <Toast
            {...toasts[0].props}
            timer={toasts[0].timer}>
            {toasts[0].content}
          </Toast>
        </CSSTransition>
      </TransitionGroup>


  );
}
