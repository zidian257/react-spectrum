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

import React, {ReactElement, ReactNode, useContext} from 'react';
import {ToastContainer} from './';
import {ToastContextProps, ToastOptions} from '@react-types/toast';
import {useProviderProps} from '@react-spectrum/provider';
import {useToastState} from '@react-stately/toast';

interface ToastProviderProps {
  children: ReactNode
}

const ToastContext = React.createContext<ToastContextProps | null>(null);

export function useToastProvider() {
  return useContext(ToastContext);
}

let keyCounter = 0;
function generateKey(pre = 'toast') {
  return `${pre}_${keyCounter++}`;
}

export function ToastProvider(props: ToastProviderProps): ReactElement {
  let {add, remove, toasts} = useToastState();

  let contextValue = {
    neutral: (content: ReactNode, options: ToastOptions = {}) => {
      add(content, {...options, toastKey: generateKey()});
    },
    positive: (content: ReactNode, options: ToastOptions = {}) => {
      add(content, {...options, toastKey: generateKey(), variant: 'positive'});
    },
    negative: (content: ReactNode, options: ToastOptions = {}) => {
      add(content, {...options, toastKey: generateKey(), variant: 'negative'});
    },
    info: (content: ReactNode, options: ToastOptions = {}) => {
      add(content, {...options, toastKey: generateKey(), variant: 'info'});
    }
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastContainer toasts={toasts} />
      {props.children}
    </ToastContext.Provider>
  );
}
