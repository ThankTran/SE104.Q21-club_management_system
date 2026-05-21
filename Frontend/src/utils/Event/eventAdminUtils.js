export const addHours = (time, hours) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const next = new Date(2024, 0, 1, h + hours, m || 0);
  return next.toTimeString().slice(0, 5);
};

export const normalizeEvent = (event, index) => ({
  eventCode: event.eventCode || `SK${String(index + 1).padStart(3, '0')}`,
  endTime: event.endTime || addHours(event.time, 2),
  organizer: event.organizer || 'Ban tổ chức',
  ...event,
});

export const createEvaluationCode = (eventCode, count) =>
  `DG-${eventCode}-${String(count + 1).padStart(2, '0')}`;

export const buildRegisteredMembers = (event, memberPool) => {
  const total = Number(event?.attendance || 0);
  if (!event || total <= 0) return [];

  return Array.from({ length: total }, (_, index) => {
    const member = memberPool[index % memberPool.length];
    const round = Math.floor(index / memberPool.length);

    return {
      ...member,
      id: `${event.eventCode}-${member.memberCode}-${index + 1}`,
      memberCode: round ? `${member.memberCode}-${round + 1}` : member.memberCode,
      registeredAt: event.date,
    };
  });
};
