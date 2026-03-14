// sidebar.js - Lógica de la ventana lateral dinámica

document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');

  if (!sidebar || !toggleBtn) return;

  // Función para alternar estado
  function toggleSidebar() {
    if (sidebar.classList.contains('expanded')) {
      sidebar.classList.remove('expanded');
      sidebar.classList.add('collapsed');
      localStorage.setItem('sidebarState', 'collapsed');
    } else {
      sidebar.classList.remove('collapsed');
      sidebar.classList.add('expanded');
      localStorage.setItem('sidebarState', 'expanded');
    }
    // Opcional: disparar un evento para que otros componentes se ajusten
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { expanded: sidebar.classList.contains('expanded') } }));
  }

  // Cargar estado guardado
  const savedState = localStorage.getItem('sidebarState');
  if (savedState === 'collapsed') {
    sidebar.classList.remove('expanded');
    sidebar.classList.add('collapsed');
  } else {
    sidebar.classList.add('expanded'); // por defecto
  }

  toggleBtn.addEventListener('click', toggleSidebar);
});
