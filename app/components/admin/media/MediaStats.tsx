'use client';

interface MediaStatsProps {
  stats: {
    total: number;
    images: number;
    videos: number;
    documents: number;
  };
  selectedCount: number;
}

export const MediaStats = ({ stats, selectedCount }: MediaStatsProps) => {
  const statItems = [
    {
      label: 'Total Archivos',
      value: stats.total,
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'blue',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Imágenes',
      value: stats.images,
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'green',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Videos',
      value: stats.videos,
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'purple',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Seleccionados',
      value: selectedCount,
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'amber',
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{item.label}</p>
              <p className={`text-3xl font-bold text-${item.color}-600`}>
                {item.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};