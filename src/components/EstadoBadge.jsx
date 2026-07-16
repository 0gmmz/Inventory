const ETIQUETAS = {
  disponible: 'Disponible',
  asignado: 'Asignado',
  en_reparacion: 'En reparación',
  baja: 'Baja',
}

export default function EstadoBadge({ estado }) {
  return <span className={`badge badge--${estado}`}>{ETIQUETAS[estado] ?? estado}</span>
}
