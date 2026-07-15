import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [
    'tr-v001-001','tr-v001-002','tr-v001-003','tr-v001-004','tr-v001-005',
    'tr-v003-001','tr-v003-002','tr-v003-003','tr-v003-004',
    'tr-open-001','tr-open-002','tr-open-003','tr-open-004','tr-open-005',
    'tr-open-006','tr-open-007','tr-open-008','tr-open-009','tr-open-010','tr-open-011',
    'TRP12563',
  ].map((id) => ({ id }));
}

export default function Page() {
  return <ClientPage />;
}
