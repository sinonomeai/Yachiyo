interface IconProps extends React.SVGAttributes<SVGElement> {
    href: string;
}
export const Icon = ({href, className,...props}:IconProps)=>{
    return (
      <svg className={`icon ${className ?? ""}`} aria-hidden="true" {...props}>
        <use className="text-[inherit]" href={href} />
      </svg>
    );
}