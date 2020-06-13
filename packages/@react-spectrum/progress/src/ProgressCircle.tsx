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

import {clamp} from '@react-aria/utils';
import {classNames, useDOMRef, useStyleProps} from '@react-spectrum/utils';
import {DOMRef} from '@react-types/shared';
import React, {CSSProperties, useEffect, useRef} from 'react';
import {SpectrumProgressCircleProps} from '@react-types/progress';
import styles from '@adobe/spectrum-css-temp/components/circleloader/vars.css';
import {useProgressBar} from '@react-aria/progress';

function ProgressCircle(props: SpectrumProgressCircleProps, ref: DOMRef<HTMLDivElement>) {
  let {
    value = 0,
    minValue = 0,
    maxValue = 100,
    size = 'M',
    variant,
    isIndeterminate = false,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...otherProps
  } = props;
  let domRef = useDOMRef(ref);
  let {styleProps} = useStyleProps(otherProps);

  value = clamp(value, minValue, maxValue);
  let {progressBarProps} = useProgressBar({...props, value});

  let subMask1Style: CSSProperties = {};
  let subMask2Style: CSSProperties = {};
  if (!isIndeterminate) {
    let percentage = (value - minValue) / (maxValue - minValue) * 100;
    let angle;
    if (percentage > 0 && percentage <= 50) {
      angle = -180 + (percentage / 50 * 180);
      subMask1Style.transform = `rotate(${angle}deg)`;
      subMask2Style.transform = 'rotate(-180deg)';
    } else if (percentage > 50) {
      angle = -180 + (percentage - 50) / 50 * 180;
      subMask1Style.transform = 'rotate(0deg)';
      subMask2Style.transform = `rotate(${angle}deg)`;
    }
  }

  if (!ariaLabel && !ariaLabelledby) {
    console.warn('ProgressCircle requires an aria-label or aria-labelledby attribute for accessibility');
  }

  let canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current) {
      let spectrumCircleWidth = window.getComputedStyle(canvasRef.current)
        .getPropertyValue('--spectrum-loader-circle-width');
      let size = parseInt(spectrumCircleWidth, 10);
      let spectrumCircleWeight = window.getComputedStyle(canvasRef.current)
        .getPropertyValue('--spectrum-loader-circle-border-size');
      let borderWidth = parseInt(spectrumCircleWeight, 10);
      let spectrumCircleTrackColor = window.getComputedStyle(canvasRef.current)
        .getPropertyValue('--spectrum-loader-circle-track-color');
      let spectrumCircleFillColor = window.getComputedStyle(canvasRef.current)
        .getPropertyValue('--spectrum-loader-circle-track-fill-color');
      let offcanvas = el.get(getAnimation(size, borderWidth, spectrumCircleTrackColor, spectrumCircleFillColor));

      let canvas = canvasRef.current;
      let ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'destination-in';
      let scale = window.devicePixelRatio;
      let scaledSize = size * scale;
      // Normalize coordinate system to use css pixels.
      ctx.scale(scale, scale);
      canvas.width = scaledSize;
      canvas.height = scaledSize;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      requestAnimationFrame(draw);

      function draw() {
        ctx.clearRect(0, 0, scaledSize, scaledSize);
        ctx.drawImage(offcanvas, 0, 0);
        requestAnimationFrame(draw);
      }
    }
  }, [canvasRef.current]);

  if (isIndeterminate) {
    return (
      <div
        {...styleProps}
        {...progressBarProps}
        ref={domRef}
        className={
          classNames(
            styles,
            'spectrum-CircleLoader',
            {
              'spectrum-CircleLoader--indeterminate': isIndeterminate,
              'spectrum-CircleLoader--small': size === 'S',
              'spectrum-CircleLoader--large': size === 'L',
              'spectrum-CircleLoader--overBackground': variant === 'overBackground'
            },
            styleProps.className
          )
        }>
        <canvas id="canvas" ref={canvasRef} />
      </div>
    );
  }


  return (
    <div
      {...styleProps}
      {...progressBarProps}
      ref={domRef}
      className={
        classNames(
          styles,
          'spectrum-CircleLoader',
          {
            'spectrum-CircleLoader--indeterminate': isIndeterminate,
            'spectrum-CircleLoader--small': size === 'S',
            'spectrum-CircleLoader--large': size === 'L',
            'spectrum-CircleLoader--overBackground': variant === 'overBackground'
          },
          styleProps.className
        )
      }>
      <div className={classNames(styles, 'spectrum-CircleLoader-track')} />
      <div className={classNames(styles, 'spectrum-CircleLoader-fills')} >
        <div className={classNames(styles, 'spectrum-CircleLoader-fillMask1')} >
          <div
            className={classNames(styles, 'spectrum-CircleLoader-fillSubMask1')}
            data-testid="fillSubMask1"
            style={subMask1Style}>
            <div className={classNames(styles, 'spectrum-CircleLoader-fill')} />
          </div>
        </div>
        <div className={classNames(styles, 'spectrum-CircleLoader-fillMask2')} >
          <div
            className={classNames(styles, 'spectrum-CircleLoader-fillSubMask2')}
            data-testid="fillSubMask2"
            style={subMask2Style} >
            <div className={classNames(styles, 'spectrum-CircleLoader-fill')} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ProgressCircles show the progression of a system operation such as downloading, uploading, processing, etc. in a visual way.
 * They can represent determinate or indeterminate progress.
 */
let _ProgressCircle = React.forwardRef(ProgressCircle);
export {_ProgressCircle as ProgressCircle};

let cubicBezier = (P0, P1, P2, P3) => (t) => (1 - t) * (1 - t) * (1 - t) * P0 + 3 * (1 - t) * (1 - t) * t * P1 + 3 * (1 - t) * t * t * P2 + t * t * t * P3;
let headAnimation = cubicBezier(.04, .72, .3, .9);
let tailAnimation = cubicBezier(0, 0, 1, 1);
let el = new Map();
function getAnimation(size = 64, strokeSize = 4, trackColor, fillColor) {
  let key = `size${size}trackColor${trackColor}fillColor${fillColor}`;
  if (el.has(key)) {
    return key;
  }

  el.set(key, document.createElement('canvas'));
  let canvas = el.get(key);
  let ctx;
  let scale;
  let scaledSize;
  ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'destination-in';
  scale = window.devicePixelRatio;
  scaledSize = size * scale;
  // Normalize coordinate system to use css pixels.
  ctx.scale(scale, scale);
  canvas.width = scaledSize;
  canvas.height = scaledSize;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  requestAnimationFrame(draw);

  function draw() {
    ctx.clearRect(0, 0, scaledSize, scaledSize);
    let centerX = scaledSize / 2;
    let centerY = scaledSize / 2;
    let radius = scaledSize / 2 - (strokeSize * scale * 2);
    let date = new Date();
    let m = date.getMilliseconds();
    let percentThrough = (m / 1000);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = trackColor;
    ctx.lineWidth = strokeSize * scale;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, (tailAnimation(percentThrough) - 0.5) * 2 * Math.PI, headAnimation(percentThrough) * 2 * Math.PI);
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = strokeSize * scale;
    ctx.stroke();
    requestAnimationFrame(draw);
  }
  return key;
}
