import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';

export function SelectInput({ value, onValueChange, options, placeholder }) {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className="inline-flex items-center justify-between w-full sm:w-48 px-3.5 py-2 text-[12px] border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 shadow-2xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50/50 hover:border-slate-350 transition-all duration-200">
        <Select.Value>
          {selectedOption ? selectedOption.label : placeholder}
        </Select.Value>
        <Select.Icon className="text-slate-400 ml-2">
          <ChevronDownIcon className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-xl border border-slate-100 shadow-lg z-[60] min-w-[200px] animate-in fade-in-50 zoom-in-95 duration-100">
          <Select.Viewport className="p-1">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="relative flex items-center w-full px-8 py-2 text-sm text-slate-700 rounded-lg cursor-pointer outline-none select-none hover:bg-blue-50 hover:text-blue-700 data-[state=checked]:bg-blue-50/50 data-[state=checked]:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 transition-colors"
              >
                <Select.ItemText className="font-medium">{opt.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-2.5 inline-flex items-center justify-center">
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
