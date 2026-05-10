import { Icon } from "@/components/Icon/Icon";

interface InputButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className1?: string;
  className2?: string;
  href: string;
  tip: string;
  disabled?: boolean;
}
export const Button = ({
  className1,
  className2,
  href,
  tip,
  disabled,
  ...props
}: InputButton) => {
  return (
    <button className={` ${className1}`} {...props}>
      <Icon
        href={href}
        className={`text-[#e0e0ec] text-[16px] ${className2}`}
      />
      
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-[8px]
      opacity-0 invisible group-hover:opacity-100 group-hover:visible
      transition-all duration-200
      bg-[#282840] border border-[#323248] rounded-[8px]
      px-[10px] py-[6px] whitespace-nowrap
      text-[#e0e0ec] text-xs">
          <span>{tip}</span>
        </div>
      
    </button>
  );
};
