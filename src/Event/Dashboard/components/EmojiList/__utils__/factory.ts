import faker from 'faker'
import {DEFAULT_EMOJIS} from 'Event/Dashboard/components/EmojiList/emoji'
import {EmojiList} from 'Event/Dashboard/components/EmojiList'

export function withEmojiList<
  T extends {
    emojiList: EmojiList | null
  }
>(attributes: T): T {
  const emojiList: EmojiList = {
    emojis: Array.from(
      {length: faker.random.number({min: 0, max: 5})},
      () => faker.random.arrayElement(DEFAULT_EMOJIS).name,
    ),
  }

  if (faker.random.boolean()) {
    emojiList.emojiWidth = faker.random.number({min: 50, max: 100})
  }

  return {
    ...attributes,
    emojiList,
  }
}
