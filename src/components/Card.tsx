interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

export default function Card({ title, children, icon }: CardProps) {
  return (
    <div className="bg-neutral-white border border-outline-variant p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 rounded-xl">
      {icon && (
        <span className="material-symbols-outlined text-4xl text-secondary icon-fill-1">{icon}</span>
      )}
      <h3 className="font-headline-md text-headline-md text-primary">{title}</h3>
      <div className="font-body-md text-body-md text-legal-gray">{children}</div>
    </div>
  );
}
