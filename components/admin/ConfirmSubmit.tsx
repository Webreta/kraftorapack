"use client";

// Form submit'inden önce onay isteyen buton (silme gibi geri alınamaz işlemler için)
export function ConfirmSubmit({
  label,
  message,
  className,
}: {
  label: string;
  message: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
