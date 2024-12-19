export function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000); // 초 단위 차이

  if (diff < 60) {
    return '방금 전';
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes}분 전`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}시간 전`;
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days}일 전`;
  } else {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }
} 