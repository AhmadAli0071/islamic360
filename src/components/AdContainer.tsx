interface AdContainerProps {
  id: string;
  size: string;
  type: 'leaderboard' | 'rectangle' | 'sidebar' | 'mobile-sticky' | 'native';
  className?: string;
  onClose?: () => void;
}

const CONTAINER_ID = 'container-cd069bef97f173a739477489c2db4db1';

export default function AdContainer({ id, type }: AdContainerProps) {
  const isPrimary = id === 'ad-content-1' && (type === 'native' || type === 'sidebar');

  if (!isPrimary) return null;

  return (
    <div className="ad-container w-full" style={{ margin: '16px 0' }}>
      <div
        id={CONTAINER_ID}
        style={{ background: '#F9F9F9', borderRadius: '8px', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      />
    </div>
  );
}
