export default function AdminCollectionsPage() {
  return (
    <div className="admin-page">
      <h1 className="admin-page__title">კოლექციები</h1>
      <div className="admin-empty">
        <p className="admin-empty__text">
          კოლექციები მართულია სიდის მეშვეობით. სინქრონიზაციისთვის გაუშვი{" "}
          <code className="admin-code">npm run db:seed</code>.
        </p>
      </div>
    </div>
  );
}
