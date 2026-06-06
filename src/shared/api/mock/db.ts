import type { Citizen } from '../../../entities/citizen';
import type { Request } from '../../../entities/request';
import {
  buildCitizen,
  buildRequest,
  createSeededRandom,
  delay,
} from './utils';

const random = createSeededRandom(42);

const citizens: Citizen[] = Array.from({ length: 240 }, (_, index) => buildCitizen(index, random));
const requests: Request[] = [];

for (let index = 0; index < 720; index += 1) {
  const citizen = citizens[index % citizens.length];
  const request = buildRequest(index, citizen.id, citizen.region, random);
  requests.push(request);
  citizen.requests.push(request.id);
}

const citizenById = new Map(citizens.map((citizen) => [citizen.id, citizen] as const));
const requestById = new Map(requests.map((request) => [request.id, request] as const));

export const mockDb = {
  citizens,
  requests,
  citizenById,
  requestById,
};

export async function simulateLatency() {
  await delay();
}
