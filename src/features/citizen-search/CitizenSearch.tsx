import { Input } from '../../shared/ui/input';

export interface CitizenSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CitizenSearch({ value, onChange }: CitizenSearchProps) {
  return (
    <Input
      label="Поиск"
      placeholder="Поиск по имени, телефону, email или номеру обращения"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
