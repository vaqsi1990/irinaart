import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <h1 className="admin-page__title">პანელი</h1>
      <div className="admin-cards">
        <div className="admin-card">
          <h2 className="admin-card__label">ნახატები</h2>
          <p className="admin-card__value">—</p>
          <Link href="/admin/paintings" className="admin-card__link">
            მართვა →
          </Link>
        </div>
        <div className="admin-card">
          <h2 className="admin-card__label">გამოფენები</h2>
          <p className="admin-card__value">—</p>
          <Link href="/admin/exhibitions" className="admin-card__link">
            მართვა →
          </Link>
        </div>
        <div className="admin-card">
          <h2 className="admin-card__label">კოლექციები</h2>
          <p className="admin-card__value">13</p>
          <Link href="/admin/collections" className="admin-card__link">
            მართვა →
          </Link>
        </div>
      </div>
      <div className="admin-welcome">
        <h2 className="admin-welcome__title">მოგესალმებით</h2>
        <p className="admin-welcome__text">
          გამოიყენეთ მენიუ მარჯვნივ ნახატების, გამოფენების და კოლექციების მართვისთვის.
        </p>
      </div>
    </div>
  );
}
