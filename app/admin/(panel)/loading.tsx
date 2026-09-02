// Panel sayfaları yüklenirken içerik alanının ortasında dönen yükleme göstergesi
export default function AdminLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div
        aria-label="Yükleniyor"
        className="size-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600"
      />
    </div>
  );
}
