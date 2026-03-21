import { faker } from "@faker-js/faker";
import type { Audiobook } from "@/lib/types";

/** Short public-domain style demo streams for the player (not real book audio). */
const DEMO_AUDIO_URLS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
];

function pickAudioUrl(seed: string) {
  const n = Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  return DEMO_AUDIO_URLS[n % DEMO_AUDIO_URLS.length];
}

export function createMockAudiobook(overrides?: Partial<Audiobook>): Audiobook {
  if (overrides?.id) {
    faker.seed(
      overrides.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0),
    );
  }

  const id = overrides?.id ?? faker.string.uuid();
  const title =
    overrides?.title ??
    `${faker.lorem.words({ min: 2, max: 4 })} — ${faker.lorem.words({ min: 2, max: 3 })}`;
  const author = overrides?.author ?? faker.person.fullName();

  return {
    id,
    title,
    author,
    description:
      overrides?.description ??
      faker.lorem.paragraph({ min: 2, max: 4 }),
    durationMinutes:
      overrides?.durationMinutes ??
      faker.number.int({ min: 12, max: 480 }),
    narrator:
      overrides?.narrator !== undefined
        ? overrides.narrator
        : faker.number.int({ min: 0, max: 1 }) === 1
          ? faker.person.fullName()
          : null,
    coverImageUrl:
      overrides?.coverImageUrl ??
      faker.image.url({ width: 400, height: 400 }),
    audioUrl: overrides?.audioUrl ?? pickAudioUrl(id),
    uploadedAt:
      overrides?.uploadedAt ??
      faker.date.recent({ days: 60 }).toISOString(),
    originalFileName: overrides?.originalFileName ?? null,
    sizeBytes: overrides?.sizeBytes ?? null,
  };
}

export function seedMockAudiobooks(count = 8): Audiobook[] {
  faker.seed(42);
  return Array.from({ length: count }, () => createMockAudiobook());
}
