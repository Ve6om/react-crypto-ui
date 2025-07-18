// SelectInput.tsx
import Select from "react-select";
import type { FC } from "react";
import type { SingleValue } from "react-select";

type Option = {
  value: string;
  label: string;
};

interface Props {
  options: Option[];
  value: Option | null;
  onChange: (selected: SingleValue<Option>) => void;
  placeholder?: string;
}

const SelectInput: FC<Props> = ({ options, value, onChange, placeholder }) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="react-select-container"
      classNamePrefix="react-select"
      styles={{
        control: (provided) => ({
          ...provided,
          backgroundColor: "#1f2937", // dark gray
          borderColor: "#374151",     // slightly lighter outline
          cursor: "pointer",
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: "#1f2937",
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? "#374151" : "#1f2937",
          color: "#f9fafb",
          cursor: "pointer",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "#f9fafb",
        }),
        input: (provided) => ({
          ...provided,
          color: "#d1d5db", // light gray for input text
        }),
      }}
    />
  );
};

export default SelectInput;
