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

export class Timer {
  private callback: () => void;
  private remaining: number;
  private timerId: NodeJS.Timeout;
  private start: number;

  constructor(callback: () => void, delay: number) {
    this.callback = callback;
    this.remaining = delay;
  }

  pause() {
    global.clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.start;
  }

  resume() {
    this.start = Date.now();
    if (this.timerId) {
      global.clearTimeout(this.timerId);
    }
    this.timerId = global.setTimeout(this.callback, this.remaining);
  }

  clear() {
    global.clearTimeout(this.timerId);
  };
}
