import Link from 'next/link';

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({ href, variant = 'primary', children, type = 'button', className = '' }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-label-bold text-label-bold uppercase tracking-wider px-8 py-4 rounded shadow-md transition-all duration-200 cursor-pointer";
  const variants = {
    primary: "bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary shadow-md hover:shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-on-primary",
    ghost: "text-primary hover:text-secondary underline-offset-4 hover:underline shadow-none",
  };
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }
  return <button type={type} className={classes}>{children}</button>;
}
