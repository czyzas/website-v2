import {
  Root,
  Trigger,
  Anchor,
  Content,
  Portal,
} from '@radix-ui/react-popover';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { cn } from '@/scripts/cn';
import { selectOptionsWrapper } from '../styles';

const Popover = Root;

const PopoverTrigger = Trigger;

const PopoverAnchor = Anchor;

const PopoverContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <Portal>
    <Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn('z-50 w-72 outline-none', selectOptionsWrapper, className)}
      {...props}
    />
  </Portal>
));
PopoverContent.displayName = Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
