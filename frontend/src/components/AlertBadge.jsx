export default function AlertBadge({ status }) {
  const styles = {
    ok: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };
  const labels = {
    ok: '✅ Ok',
    warning: '⚠️ Próximo',
    danger: '🔴 Atrasado',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] || styles.ok}`}>
      {labels[status] || status}
    </span>
  );
}
