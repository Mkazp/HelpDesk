import { Input } from '../../shared/ui/input';
import { Select } from '../../shared/ui/select';
import { Button } from '../../shared/ui/button';
import type { CitizenEducationLevel, CitizenEmploymentStatus, CitizenFamilyStatus, CitizenSocialStatus } from '../../entities/citizen';
import styles from './CitizenFilters.module.css';

export interface CitizenFiltersValue {
  region: string;
  status: string;
  category: string;
  priority: string;
  createdFrom: string;
  createdTo: string;
}

export interface CitizenFiltersProps {
  value: CitizenFiltersValue;
  regions: string[];
  onChange: (value: CitizenFiltersValue) => void;
  onReset: () => void;
}

const statusOptions: Array<{ label: string; value: CitizenEmploymentStatus | CitizenSocialStatus }> = [
  { label: 'Работает', value: 'employed' },
  { label: 'Безработный', value: 'unemployed' },
  { label: 'Пенсионер', value: 'retired' },
  { label: 'Студент', value: 'student' },
  { label: 'Социально уязвимый', value: 'vulnerable' },
  { label: 'Самозанятый', value: 'self_employed' },
];

const categoryOptions: Array<{ label: string; value: CitizenEducationLevel }> = [
  { label: 'Среднее', value: 'secondary' },
  { label: 'Среднее специальное', value: 'vocational' },
  { label: 'Бакалавр', value: 'bachelor' },
  { label: 'Магистр', value: 'master' },
  { label: 'Кандидат/доктор наук', value: 'phd' },
];

const priorityOptions: Array<{ label: string; value: CitizenFamilyStatus }> = [
  { label: 'Не женат/не замужем', value: 'single' },
  { label: 'В браке', value: 'married' },
  { label: 'Разведён(а)', value: 'divorced' },
  { label: 'Вдовец/вдова', value: 'widowed' },
  { label: 'С детьми', value: 'with_children' },
];

export function CitizenFilters({ value, regions, onChange, onReset }: CitizenFiltersProps) {
  return (
    <section className={styles.card}>
      <div className={styles.grid}>
        <Select
          label="Регион"
          value={value.region}
          onChange={(event) => onChange({ ...value, region: event.target.value })}
          options={regions.map((region) => ({ value: region, label: region }))}
          placeholder="Все регионы"
        />
        <Select
          label="Статус"
          value={value.status}
          onChange={(event) => onChange({ ...value, status: event.target.value })}
          options={statusOptions}
          placeholder="Все статусы"
        />
        <Select
          label="Категория"
          value={value.category}
          onChange={(event) => onChange({ ...value, category: event.target.value })}
          options={categoryOptions}
          placeholder="Все категории"
        />
        <Select
          label="Семейный статус"
          value={value.priority}
          onChange={(event) => onChange({ ...value, priority: event.target.value })}
          options={priorityOptions}
          placeholder="Все значения"
        />
        <Input
          label="Создано с"
          type="date"
          value={value.createdFrom}
          onChange={(event) => onChange({ ...value, createdFrom: event.target.value })}
        />
        <Input
          label="Создано по"
          type="date"
          value={value.createdTo}
          onChange={(event) => onChange({ ...value, createdTo: event.target.value })}
        />
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" size="sm" onClick={onReset}>
          Сбросить фильтры
        </Button>
      </div>
    </section>
  );
}
