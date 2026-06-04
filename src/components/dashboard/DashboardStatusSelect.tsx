type DashboardStatusOption<TValue extends string> = {
  label: string;
  value: TValue;
};

export default function DashboardStatusSelect<TValue extends string>({
  disabled,
  fullWidth = false,
  label = "Update status",
  onChange,
  options,
  value,
}: {
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
  onChange: (value: TValue) => void;
  options: readonly DashboardStatusOption<TValue>[];
  value: TValue;
}) {
  return (
    <label className={`inline-flex ${fullWidth ? "w-full" : ""}`}>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
        className={`${fullWidth ? "w-full" : "w-[132px]"} h-[34px] rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#0A3D79] focus:ring-2 focus:ring-[#0A3D79]/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
