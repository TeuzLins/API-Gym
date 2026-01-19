export function addDuration(date: Date, duration: string) {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error('Duração inválida');
  }
  const value = Number(match[1]);
  const unit = match[2];
  const msMap: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return new Date(date.getTime() + value * msMap[unit]);
}
