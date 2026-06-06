import {
  educationDegrees,
  employees,
  familyRelations,
  firstNamesFemale,
  firstNamesMale,
  lastNames,
  organizationNames,
  citiesByRegion,
  regions,
  requestSources,
  requestTitles,
  streets,
} from "./constants";
import type {
  Citizen,
  CitizenEducationLevel,
  CitizenEmploymentStatus,
  CitizenFamilyStatus,
  CitizenGender,
  CitizenSocialStatus,
} from "../../../entities/citizen";
import type {
  Request,
  RequestCategory,
  RequestPriority,
  RequestStatus,
} from "../../../entities/request";

const now = Date.now();
export function createSeededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function pickOne<T>(items: readonly T[], random: () => number) {
  return items[Math.floor(random() * items.length)];
}

export function pickMany<T>(
  items: readonly T[],
  random: () => number,
  count: number,
) {
  const pool = [...items];
  const result: T[] = [];

  while (pool.length > 0 && result.length < count) {
    const index = Math.floor(random() * pool.length);
    const [picked] = pool.splice(index, 1);
    if (picked !== undefined) {
      result.push(picked);
    }
  }

  return result;
}

export function shiftDate(days: number, random: () => number, spread = 18) {
  const variation = Math.floor((random() - 0.5) * spread);
  return new Date(now - (days + variation) * 24 * 60 * 60 * 1000);
}

export function toIso(date: Date) {
  return date.toISOString();
}

function transliterate(value: string) {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return value
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

export function buildCitizen(index: number, random: () => number): Citizen {
  const gender: CitizenGender = random() > 0.5 ? "male" : "female";
  const firstName =
    gender === "male"
      ? pickOne(firstNamesMale, random)
      : pickOne(firstNamesFemale, random);
  const lastName = pickOne(lastNames, random);
  const region = pickOne(regions, random);
  const cityName = pickOne(citiesByRegion[region], random);
  const street = pickOne(streets, random);
  const age = 20 + Math.floor(random() * 55);
  const birthDate = new Date(now - age * 365.25 * 24 * 60 * 60 * 1000);
  const socialStatuses: CitizenSocialStatus[] = [
    "employed",
    "unemployed",
    "retired",
    "student",
    "vulnerable",
  ];
  const educationLevels: CitizenEducationLevel[] = [
    "secondary",
    "vocational",
    "bachelor",
    "master",
    "phd",
  ];
  const employmentStatuses: CitizenEmploymentStatus[] = [
    "employed",
    "unemployed",
    "self_employed",
    "retired",
    "student",
  ];
  const familyStatuses: CitizenFamilyStatus[] = [
    "single",
    "married",
    "divorced",
    "widowed",
    "with_children",
  ];
  const documentBase = 1000000000 + index * 17;
  const createdAt = shiftDate(540 - Math.floor(index * 1.5), random, 90);
  const updatedAt = shiftDate(60 - Math.floor(index / 4), random, 40);
  const familyCount = Math.floor(random() * 4);
  const familyMembers = Array.from(
    { length: familyCount },
    (_, memberIndex) => ({
      id: `fam-${index}-${memberIndex}`,
      fullName: `${pickOne(firstNamesMale.concat(firstNamesFemale), random)} ${pickOne(lastNames, random)}`,
      relation: pickOne(familyRelations, random),
      birthDate: toIso(shiftDate(1200 + memberIndex * 200, random, 300)),
      age: 5 + Math.floor(random() * 70),
    }),
  );
  const documentCount = 1 + Math.floor(random() * 2);
  const documents = Array.from(
    { length: documentCount },
    (_, documentIndex) => ({
      id: `doc-${index}-${documentIndex}`,
      type: documentIndex === 0 ? "Паспорт" : "СНИЛС",
      number: `${documentBase + documentIndex}`,
      issuedAt: toIso(shiftDate(2000 + documentIndex * 120, random, 400)),
      expiresAt: toIso(
        new Date(now + (365 * 2 + index + documentIndex) * 24 * 60 * 60 * 1000),
      ),
      issuer: "Муниципальный отдел ЗАГС",
    }),
  );
  const educationHistory = [
    {
      id: `edu-${index}-1`,
      institution: pickOne(organizationNames, random),
      degree: pickOne(educationDegrees, random),
      startDate: toIso(shiftDate(3200, random, 600)),
      endDate: random() > 0.4 ? toIso(shiftDate(2400, random, 500)) : null,
    },
  ];
  const employmentHistory = [
    {
      id: `emp-${index}-1`,
      organization: pickOne(organizationNames, random),
      position: pickOne(
        ["Аналитик", "Специалист", "Координатор", "Инспектор"],
        random,
      ),
      startDate: toIso(shiftDate(1000, random, 320)),
      endDate: random() > 0.6 ? toIso(shiftDate(120, random, 60)) : null,
    },
  ];

  return {
    id: `citizen-${index + 1}`,
    fullName: `${firstName} ${lastName}`,
    birthDate: toIso(birthDate),
    age,
    gender,
    phone: `+7 (9${Math.floor(random() * 90) + 10}) ${Math.floor(100 + random() * 900)}-${Math.floor(10 + random() * 90)}-${Math.floor(10 + random() * 90)}`,
    email: `${transliterate(firstName)}.${transliterate(lastName)}${index + 1}@example.com`,
    region,
    city: cityName,
    address: `${Math.floor(1 + random() * 180)} ${street}, apt. ${Math.floor(1 + random() * 300)}`,
    documentNumber: `${documentBase}`,
    socialStatus: pickOne(socialStatuses, random),
    educationLevel: pickOne(educationLevels, random),
    employmentStatus: pickOne(employmentStatuses, random),
    familyStatus: pickOne(familyStatuses, random),
    createdAt: toIso(createdAt),
    updatedAt: toIso(updatedAt),
    familyMembers,
    documents,
    requests: [],
    educationHistory,
    employmentHistory,
  };
}

export function buildRequest(
  index: number,
  citizenId: string,
  region: string,
  random: () => number,
): Request {
  const statuses: RequestStatus[] = [
    "new",
    "in_progress",
    "pending",
    "completed",
    "overdue",
    "rejected",
  ];
  const priorities: RequestPriority[] = ["low", "medium", "high", "critical"];
  const categories: RequestCategory[] = [
    "waste_management",
    "ecology",
    "infrastructure",
    "complaint",
    "consultation",
    "other",
  ];
  const createdAt = shiftDate(90 - index, random, 45);
  const dueDate = shiftDate(-10 + Math.floor(random() * 30), random, 10);

  return {
    id: `request-${index + 1}`,
    number: `REQ-${String(index + 1).padStart(6, "0")}`,
    citizenId,
    title: pickOne(requestTitles, random),
    description: "Обращение сгенерировано из тестового набора данных.",
    category: pickOne(categories, random),
    status: pickOne(statuses, random),
    priority: pickOne(priorities, random),
    source: pickOne(requestSources, random),
    region,
    responsibleEmployee: pickOne(employees, random),
    createdAt: toIso(createdAt),
    dueDate: toIso(dueDate),
    updatedAt: toIso(
      shiftDate(
        Math.max(
          1,
          Math.floor(
            (Date.now() - createdAt.getTime()) / (24 * 60 * 60 * 1000),
          ) / 2,
        ),
        random,
        20,
      ),
    ),
    attachmentsCount: Math.floor(random() * 4),
    commentsCount: Math.floor(random() * 12),
  };
}

export function delay(ms = 140) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}
