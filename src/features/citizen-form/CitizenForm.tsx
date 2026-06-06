import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  Citizen,
  CitizenEducationLevel,
  CitizenEmploymentStatus,
  CitizenFamilyStatus,
  CitizenSocialStatus,
  CitizenUpdateInput,
} from '../../entities/citizen';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { Select } from '../../shared/ui/select';
import styles from './CitizenForm.module.css';

const schema = z.object({
  fullName: z.string().min(3, 'Введите ФИО'),
  phone: z.string().min(7, 'Введите номер телефона'),
  email: z.string().email('Введите корректный email'),
  region: z.string().min(2, 'Выберите регион'),
  city: z.string().min(2, 'Введите город'),
  address: z.string().min(5, 'Введите адрес'),
  socialStatus: z.enum(['employed', 'unemployed', 'retired', 'student', 'vulnerable']),
  educationLevel: z.enum(['secondary', 'vocational', 'bachelor', 'master', 'phd']),
  employmentStatus: z.enum(['employed', 'unemployed', 'self_employed', 'retired', 'student']),
  familyStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'with_children']),
});

export type CitizenFormValues = z.infer<typeof schema>;

export interface CitizenFormProps {
  citizen?: Citizen;
  onSubmit: (values: CitizenUpdateInput) => Promise<void> | void;
  submitLabel?: string;
}

const socialStatusOptions: Array<{ label: string; value: CitizenSocialStatus }> = [
  { label: 'Работает', value: 'employed' },
  { label: 'Безработный', value: 'unemployed' },
  { label: 'Пенсионер', value: 'retired' },
  { label: 'Студент', value: 'student' },
  { label: 'Социально уязвимый', value: 'vulnerable' },
];

const educationLevelOptions: Array<{ label: string; value: CitizenEducationLevel }> = [
  { label: 'Среднее', value: 'secondary' },
  { label: 'Среднее специальное', value: 'vocational' },
  { label: 'Бакалавр', value: 'bachelor' },
  { label: 'Магистр', value: 'master' },
  { label: 'Кандидат/доктор наук', value: 'phd' },
];

const employmentStatusOptions: Array<{ label: string; value: CitizenEmploymentStatus }> = [
  { label: 'Трудоустроен', value: 'employed' },
  { label: 'Не трудоустроен', value: 'unemployed' },
  { label: 'Самозанятый', value: 'self_employed' },
  { label: 'На пенсии', value: 'retired' },
  { label: 'Студент', value: 'student' },
];

const familyStatusOptions: Array<{ label: string; value: CitizenFamilyStatus }> = [
  { label: 'Не женат/не замужем', value: 'single' },
  { label: 'В браке', value: 'married' },
  { label: 'Разведён(а)', value: 'divorced' },
  { label: 'Вдовец/вдова', value: 'widowed' },
  { label: 'С детьми', value: 'with_children' },
];

export function CitizenForm({ citizen, onSubmit, submitLabel = 'Сохранить изменения' }: CitizenFormProps) {
  const form = useForm<CitizenFormValues>({
    resolver: zodResolver(schema),
    defaultValues: citizen
      ? {
          fullName: citizen.fullName,
          phone: citizen.phone,
          email: citizen.email,
          region: citizen.region,
          city: citizen.city,
          address: citizen.address,
          socialStatus: citizen.socialStatus,
          educationLevel: citizen.educationLevel,
          employmentStatus: citizen.employmentStatus,
          familyStatus: citizen.familyStatus,
        }
      : {
          fullName: '',
          phone: '',
          email: '',
          region: '',
          city: '',
          address: '',
          socialStatus: 'employed',
          educationLevel: 'secondary',
          employmentStatus: 'employed',
          familyStatus: 'single',
        },
  });

  useEffect(() => {
    if (!citizen) {
      return;
    }

    form.reset({
      fullName: citizen.fullName,
      phone: citizen.phone,
      email: citizen.email,
      region: citizen.region,
      city: citizen.city,
      address: citizen.address,
      socialStatus: citizen.socialStatus,
      educationLevel: citizen.educationLevel,
      employmentStatus: citizen.employmentStatus,
      familyStatus: citizen.familyStatus,
    });
  }, [citizen, form]);

  const submitHandler = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form className={styles.form} onSubmit={submitHandler}>
      <div className={styles.grid}>
        <Input label="ФИО" error={form.formState.errors.fullName?.message} {...form.register('fullName')} />
        <Input label="Телефон" error={form.formState.errors.phone?.message} {...form.register('phone')} />
        <Input label="Электронная почта" error={form.formState.errors.email?.message} {...form.register('email')} />
        <Input label="Регион" error={form.formState.errors.region?.message} {...form.register('region')} />
        <Input label="Город" error={form.formState.errors.city?.message} {...form.register('city')} />
        <Input label="Адрес" error={form.formState.errors.address?.message} {...form.register('address')} />
        <Select label="Социальный статус" options={socialStatusOptions} error={form.formState.errors.socialStatus?.message} {...form.register('socialStatus')} />
        <Select label="Уровень образования" options={educationLevelOptions} error={form.formState.errors.educationLevel?.message} {...form.register('educationLevel')} />
        <Select label="Статус занятости" options={employmentStatusOptions} error={form.formState.errors.employmentStatus?.message} {...form.register('employmentStatus')} />
        <Select label="Семейный статус" options={familyStatusOptions} error={form.formState.errors.familyStatus?.message} {...form.register('familyStatus')} />
      </div>

      <div className={styles.actions}>
        <Button type="submit" loading={form.formState.isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
