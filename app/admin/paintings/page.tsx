import Link from "next/link";

export default function AdminPaintingsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page__title">ნახატები</h1>
        <Link href="/admin/paintings/new" className="siteNav__link">
          ნახატის დამატება
        </Link>
      </div>
      <div className="admin-empty">
        <p className="admin-empty__text">ნახატები ჯერ არ არის. დაამატე პირველი ნახატი.</p>
      </div>
    </div>
  );
}
