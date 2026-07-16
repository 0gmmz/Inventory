/** Etiqueta de activo: ID interno o serie con marcas tipo código de barras. */
export default function AssetTag({ children }) {
  return (
    <span className="asset-tag">
      <span className="bars" aria-hidden="true"><i/><i/><i/><i/><i/></span>
      {children}
    </span>
  )
}
