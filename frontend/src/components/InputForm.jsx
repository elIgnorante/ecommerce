// Álvaro Zermeño

export const InputForm = ({
  field,
  Icon,
  labelText,
  placeholder,
  type,
  value,
  onChange,
  formData,
  setFormData
}) => {
  const inputValue =
    value !== undefined
      ? value
      : formData
      ? formData[field] || ""
      : "";

  const handleChange = onChange
    ? onChange
    : setFormData
    ? (e) => setFormData({ ...formData, [field]: e.target.value })
    : undefined;

  return (
    <div>
      <label htmlFor={field} className="block text-sm font-medium text-gray-300">
        {labelText}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type={type}
          id={field}
          required
          value={inputValue}
          onChange={handleChange}
          className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
            placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}