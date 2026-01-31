import Link from "next/link";

export default function AdminExhibitionsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page__title">გამოფენები</h1>
        <Link href="/admin/exhibitions/new" className="siteNav__link">
          გამოფენის დამატება
        </Link>
      </div>
      <div className="admin-empty">
        <p className="admin-empty__text">გამოფენები ჯერ არ არის. დაამატე პირველი გამოფენა.</p>
      </div>
    </div>
  );
}
