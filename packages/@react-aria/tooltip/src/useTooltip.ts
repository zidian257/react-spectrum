import {AllHTMLAttributes, useContext} from 'react';
import {DOMProps} from '@react-types/shared';
import {HoverResponderContext} from '@react-aria/interactions';
import {useId} from '@react-aria/utils';

interface TooltipProps extends DOMProps {
  role?: 'tooltip'
}

interface TooltipAria {
  tooltipProps: AllHTMLAttributes<HTMLElement>
}

export function useTooltip(props: TooltipProps): TooltipAria {
  let contextProps = useContext(HoverResponderContext);
  let tooltipId = useId(props.id);

  let {
    role = 'tooltip'
  } = props;

  let tooltipProps;
  tooltipProps = {
    'aria-describedby': tooltipId,
    role,
    id: tooltipId
  };

  // console.log('useTooltip', contextProps)

  if (contextProps) {
    let onMouseLeave = () => {
      if (contextProps.onHoverTooltip) {
        contextProps.onHoverTooltip(false);
      }
    };
    let onMouseEnter = (e) => {
      console.log('on mouse enter from useTooltip');
      // this is called before delayed hide so you have to block that method somehow
          // something with context?
          // otherLibrary.testFunction = function(){} & method overriding ... not an option since this happens first
          // set a global boolean here ... using module.exports or localStorage is not acceptable 
      console.log(e.target) // the tooltip
      console.log(e.relatedTarget) // the story
    };
    tooltipProps.onMouseLeave = onMouseLeave;
    tooltipProps.onMouseEnter = onMouseEnter;
  }

  return {
    tooltipProps
  };
}
