import * as Icons from 'lucide-react';
import type { SVGProps } from 'react';

export type IconName = keyof typeof Icons;

export function Icon({
  name,
  ...props
}: { name: IconName } & SVGProps<SVGSVGElement>) {
  const IconComponent = (Icons as unknown as Record<string, (p: SVGProps<SVGSVGElement>) => JSX.Element>)[
    name as string
  ];
  return <IconComponent aria-hidden="true" {...props} />;
}


