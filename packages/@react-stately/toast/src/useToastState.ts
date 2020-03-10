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

import {ReactNode, useRef, useState} from 'react';
import {Timer} from './';
import {ToastOptions} from '@react-types/toast';


// Is this needed?
interface ToastStateProps extends ToastOptions{
  variant?: 'positive' | 'negative' | 'info'
}

// Object used to store a Toast in state
interface ToastStateValue {
  content: ReactNode,
  props: ToastStateProps,
  timer: any
}


interface ToastState {
  add?: (content: ReactNode, options: ToastStateProps) => void,
  remove?: (toastKey: string) => void,
  setToasts?: (value: any) => void,
  toasts?: ToastStateValue[]
}

const TOAST_TIMEOUT = 9000;

export function useToastState(props?: any): ToastState {
  let [toasts, setToasts] = useState(props && props.value || []);

  const add = (content: ReactNode, options: ToastStateProps) => {
    let timer;

    // set timer to remove toasts
    if (!(options.actionLabel || options.timeout === 0)) {
      if (options.timeout < 0) {
        options.timeout = TOAST_TIMEOUT;
      }
      console.log("timer being set", options)
      timer = new Timer(() => remove(options.toastKey), options.timeout || TOAST_TIMEOUT);
    }

    let newToast = {
      content,
      props: options,
      timer
    };
    setToasts(prevToasts => [...prevToasts, newToast]);
  };

  const remove = (toastKey: string) => {
    setToasts(prevToasts => [...prevToasts].filter(item => {
      if (item.props.toastKey === toastKey && item.timer) {
        item.timer.clear();
      }
      return item.props.toastKey !== toastKey;
    }));
  };

  return {
    add,
    remove,
    setToasts,
    toasts
  };
}
