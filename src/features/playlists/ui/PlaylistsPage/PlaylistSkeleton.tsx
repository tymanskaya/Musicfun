import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const PlaylistSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>

        {/* 1. ЗАГОЛОВОК СТРАНИЦЫ */}
        <div style={{ marginBottom: '40px' }}>
          <Skeleton width={280} height={45} />
        </div>

        {/* 2. ФОРМА СОЗДАНИЯ ПЛЕЙЛИСТА */}
        <div style={{ marginBottom: '30px', border: '1px solid #f0f0f0', padding: '15px', borderRadius: '8px' }}>
          <Skeleton width={200} height={28} style={{ marginBottom: '15px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Skeleton width={250} height={35} /> {/* Title input */}
            <Skeleton width={250} height={35} /> {/* Description input */}
            <Skeleton width={140} height={40} style={{ marginTop: '5px' }} /> {/* Create button */}
          </div>
        </div>

        {/* 3. ПОИСКОВАЯ СТРОКА */}
        <div style={{ marginBottom: '40px' }}>
          <Skeleton width="100%" height={45} borderRadius={4} />
        </div>

        {/* 4. СЕТКА КАРТОЧЕК (ПЛЕЙЛИСТЫ) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '25px',
          marginBottom: '50px'
        }}>
          {Array(4).fill(0).map((_, index) => (
            <div key={index} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
              {/* Имитация обложки (диск) */}
              <Skeleton height={200} style={{ marginBottom: '15px' }} />

              {/* Инфо о плейлисте */}
              <Skeleton width="80%" height={20} style={{ marginBottom: '10px' }} />
              <div style={{ marginBottom: '15px' }}>
                <Skeleton count={2} />
              </div>

              {/* Кнопки управления */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <Skeleton width={70} height={32} />
                <Skeleton width={70} height={32} />
              </div>
            </div>
          ))}
        </div>

        {/* 5. ПАГИНАЦИЯ (ПОСЛЕДНИЙ СКРИНШОТ) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '25px',
          padding: '20px 0',
          borderTop: '1px solid #f0f0f0'
        }}>
          {/* Кнопки страниц [1] [2] ... [377] */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Skeleton width={35} height={35} />
            <Skeleton width={35} height={35} />
            <span style={{ color: '#ccc', fontWeight: 'bold' }}>...</span>
            <Skeleton width={50} height={35} />
          </div>

          {/* Настройка количества на странице */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Skeleton width={150} height={20} />
          </div>
        </div>

      </div>
    </SkeletonTheme>
  );
};



