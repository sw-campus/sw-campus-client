'use client'

type LabeledInputProps = {
  label: string
  value: string
  onChangeValue: (value: string) => void

  type?: React.HTMLInputTypeAttribute
  name?: string
  placeholder?: string
  disabled?: boolean

  // 폼마다 INPUT_BASE_CLASS가 다를 수 있어서 외부에서 주입 가능하게
  className?: string
}

export default function LabeledInput({
  label,
  value,
  onChangeValue,
  type = 'text',
  name,
  placeholder,
  disabled,
  className = '',
}: LabeledInputProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-white/75">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={e => onChangeValue(e.target.value)}
        className={`${className} w-full`}
      />
    </div>
  )
}
