interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'default' | 'ghost';
}

export function Button({
  children,
  className = "",
  isLoading = false,
  variant = 'default',
  ...props
}: ButtonProps) {
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600',
    ghost: 'bg-transparent text-gray-800 hover:bg-gray-100 hover:text-gray-900'
  };

  return (
    <button
      className={`w-full max-w-xs mx-auto block py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
