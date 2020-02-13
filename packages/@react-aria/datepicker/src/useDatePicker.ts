import {DatePickerProps, DateRangePickerProps} from '@react-types/datepicker';
import {DatePickerState, DateRangePickerState} from '@react-stately/datepicker';
import {DOMProps} from '@react-types/shared';
import {HTMLAttributes, KeyboardEvent} from 'react';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {mergeProps, useId, useLabels} from '@react-aria/utils';
import {SpectrumBaseDialogProps} from '@react-types/dialog';
import {useDateFormatter, useMessageFormatter} from '@react-aria/i18n';
import {useMemo} from 'react';
import {usePress} from '@react-aria/interactions';

interface DatePickerAria {
  groupProps: HTMLAttributes<HTMLElement>,
  fieldProps: HTMLAttributes<HTMLElement>,
  fieldGroupProps: HTMLAttributes<HTMLElement>,
  buttonProps: HTMLAttributes<HTMLElement>,
  dialogProps: SpectrumBaseDialogProps
}

type DatePickerAriaProps = (DatePickerProps | DateRangePickerProps) & DOMProps;

export function useDatePicker(props: DatePickerAriaProps, state: DatePickerState | DateRangePickerState): DatePickerAria {
  let buttonId = useId();
  let dialogId = useId();
  let fieldGroupId = useId();
  let formatMessage = useMessageFormatter(intlMessages);
  let labels = useLabels(props, formatMessage('date'));
  let labelledBy = labels['aria-labelledby'] || labels.id;
  let dateValue = useMemo(
    () => state.value ? formatMessage('currentDate', {date: state.value}) : '',
    [formatMessage, state.value]
  );

  // When a touch event occurs on the date field, open the calendar instead.
  // The date segments are too small to interact with on a touch device.
  // TODO: time picker in popover??
  let {pressProps} = usePress({
    onPress: (e) => {
      // really should detect if there is a keyboard attached too, but not sure how to do that.
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        state.setOpen(true);
      }
    }
  });

  // Open the popover on alt + arrow down
  let onKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      state.setOpen(true);
    }
  };

  return {
    groupProps: {
      role: 'group',
      'aria-disabled': props.isDisabled || null,
      ...mergeProps(pressProps, {onKeyDown}),
      ...labels,
      'title': dateValue
    },
    fieldGroupProps: {
      id: fieldGroupId
    },
    fieldProps: {
      'aria-labelledby': labelledBy,
      'aria-invalid': state.validationState === 'invalid' || null,
      'aria-readonly': props.isReadOnly || null,
      'aria-required': props.isRequired || null
    },
    buttonProps: {
      id: buttonId,
      'aria-haspopup': 'dialog',
      'aria-label': formatMessage('calendar'),
      'aria-labelledby': `${labelledBy} ${buttonId}`
    },
    dialogProps: {
      id: dialogId
    }
  };
}
