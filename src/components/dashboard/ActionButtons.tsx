import Link from "next/link";

interface ActionButton {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
}

export default function ActionButtons({ buttons }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {buttons.map((button, index) => (
        button.href ? (
          <Link 
            key={index}
            href={button.href}
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow transition-all"
          >
            <span className="text-gray-800 font-medium">{button.label}</span>
          </Link>
        ) : (
          <button
            key={index}
            onClick={button.onClick}
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow transition-all"
          >
            <span className="text-gray-800 font-medium">{button.label}</span>
          </button>
        )
      ))}
    </div>
  );
}
