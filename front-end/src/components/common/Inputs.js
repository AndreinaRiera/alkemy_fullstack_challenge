
export function InputText({placeholder, ref, ...rest}) {
  return (
    <input type="text" class="form-control" {...rest} placeholder={placeholder} aria-label={placeholder} aria-describedby={ref} />
  )
} 