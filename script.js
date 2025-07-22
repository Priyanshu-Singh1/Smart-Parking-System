document.addEventListener('DOMContentLoaded', () => {
  const slotGrid = document.getElementById('slot-grid');
  const slots = [
    { id: 'slot_1', status: 'free' },
    { id: 'slot_2', status: 'occupied' },
    { id: 'slot_3', status: 'free' }
  ];
  slots.forEach(slot => {
    const div = document.createElement('div');
    div.className = `slot text-white p-6 text-xl rounded-lg shadow-lg transition transform hover:scale-105 ${slot.status === 'free' ? 'slot-free' : 'slot-occupied'}`;
    div.textContent = `${slot.id.toUpperCase()} - ${slot.status}`;
    slotGrid.appendChild(div);
  });
});
