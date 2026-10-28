import type { Category, Story, TransformOption } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'real-life',
    label: 'Real-Life Paranormal Experiences',
    blurb: 'Firsthand accounts of events people could not explain.',
    icon: 'Eye',
  },
  {
    id: 'ghost-encounters',
    label: 'Ghost Encounters',
    blurb: 'Apparitions, presences, and figures from beyond.',
    icon: 'Ghost',
  },
  {
    id: 'haunted-places',
    label: 'Haunted Places',
    blurb: 'Locations with histories written in shadow.',
    icon: 'Home',
  },
  {
    id: 'unexplained',
    label: 'Unexplained Events',
    blurb: 'Occurrences that defy ordinary explanation.',
    icon: 'HelpCircle',
  },
  {
    id: 'horror-fiction',
    label: 'Horror Fiction',
    blurb: 'Crafted tales of dread, imagination, and fear.',
    icon: 'BookMarked',
  },
  {
    id: 'psychological-horror',
    label: 'Psychological Horror',
    blurb: 'Terrors that unfold within the mind.',
    icon: 'Brain',
  },
];

export const TRANSFORM_OPTIONS: TransformOption[] = [
  {
    id: 'ghost-story',
    label: 'Turn into a Ghost Story',
    description: 'Rewrite the text as a chilling ghost story with spectral presence.',
    icon: 'Ghost',
  },
  {
    id: 'mysterious',
    label: 'Make It More Mysterious',
    description: 'Deepen the mystery with unanswered questions and creeping dread.',
    icon: 'Eye',
  },
  {
    id: 'psychological',
    label: 'Add a Psychological Horror Twist',
    description: 'Introduce a unsettling turn rooted in the mind.',
    icon: 'Brain',
  },
  {
    id: 'unexpected-ending',
    label: 'Create an Unexpected Ending',
    description: 'Reimagine the conclusion with a startling final turn.',
    icon: 'Sparkles',
  },
  {
    id: 'atmospheric',
    label: 'Rewrite as Atmospheric Horror',
    description: 'Build dread through setting, texture, and mood.',
    icon: 'Wind',
  },
];

export const DEMO_STORIES: Story[] = [
  {
    id: 'seed-story-week',
    title: 'The Room That Listened Back',
    content:
      'The apartment on Holloway Street was cheap for a reason, though the listing never said why. I moved in on a Tuesday in October, and by the first night I understood. The walls were thin — not in the way that lets in the neighbor\'s television, but in the way that lets in something else. Each night at 2:13 exactly, the apartment grew quiet in a way that felt deliberate. The hum of the refrigerator would stop. The traffic outside would stop. Even the dust, I swear, would stop.\n\nThen the whispers began. Not from any direction. From the walls themselves, as though the plaster remembered conversations that had happened there years before. I started leaving a notebook on the kitchen counter. Each morning, a new line appeared in handwriting that was almost, but not quite, my own.\n\nI stopped sleeping. I stopped eating. I started listening. And the room — the room listened back. When I finally moved out, I left the notebook behind. I did not want to know what it would write next without me.',
    excerpt:
      'The apartment on Holloway Street was cheap for a reason. Each night at 2:13 exactly, the apartment grew quiet in a way that felt deliberate.',
    category: 'haunted-places',
    author: 'Anonymous',
    isFiction: true,
    createdAt: Date.parse('2026-10-19T00:00:00Z'),
    reactions: { shiver: 142, skull: 88, heart: 60 },
  },
  {
    id: 'seed-1',
    title: 'The Footsteps in the Attic',
    content:
      'We moved into an old farmhouse outside Carlisle when I was eleven. For the first month, nothing. Then, every night around midnight, footsteps paced the length of the attic above my bedroom. My parents insisted it was squirrels. The pest control company found nothing. One night I climbed the ladder and opened the hatch. The footsteps stopped at the exact moment I pulled it down. The attic was empty. The dust on the floor was undisturbed — except for a single trail of footprints leading from the hatch to the far wall and back. The footprints were smaller than mine.',
    excerpt:
      'Every night around midnight, footsteps paced the length of the attic. The pest control company found nothing.',
    category: 'ghost-encounters',
    author: 'Mara W.',
    isFiction: false,
    createdAt: Date.parse('2026-10-24T00:00:00Z'),
    reactions: { shiver: 96, skull: 41, heart: 73 },
  },
  {
    id: 'seed-2',
    title: 'She Always Knocked Three Times',
    content:
      'My grandmother passed in the winter of 2019. She lived alone in the same cottage for fifty years, and she had a habit: before entering any room, she knocked three times. It was a small ritual, something about respect for the space. The morning after her funeral, my mother and I sat in the cottage sorting her things. We heard it. Three knocks on the kitchen door. We opened it. No one there. We closed it. Three knocks again, this time on the window. We have never been able to explain it. It happened every day for a week, then stopped. I still knock three times before I enter a room.',
    excerpt:
      'The morning after her funeral, we heard three knocks on the kitchen door. We opened it. No one there.',
    category: 'real-life',
    author: 'D. Halloran',
    isFiction: false,
    createdAt: Date.parse('2026-10-26T00:00:00Z'),
    reactions: { shiver: 134, skull: 22, heart: 210 },
  },
  {
    id: 'seed-3',
    title: 'The Photograph That Changed',
    content:
      'I took a photo of the stairwell in the old library at university. Just a phone snapshot, nothing staged. When I looked at it later, there was a figure at the bottom of the stairs — a woman in a dark dress, her face turned away. I assumed it was another student and forgot about it. A week later I scrolled back to the photo. The figure was one step higher. I checked again two days later. Higher still. I deleted the photo. The next morning it was back in my camera roll, and the figure was at the top of the stairs. I deleted it, wiped my trash, and restarted the phone. It is gone now. I do not take photos in that library anymore.',
    excerpt:
      'A week later I scrolled back to the photo. The figure was one step higher.',
    category: 'unexplained',
    author: 'Anonymous',
    isFiction: false,
    createdAt: Date.parse('2026-10-27T00:00:00Z'),
    reactions: { shiver: 88, skull: 67, heart: 34 },
  },
  {
    id: 'seed-4',
    title: 'The Tenant on the Third Floor',
    content:
      'The building had three floors, but the landlord only ever rented two. The third floor had its own entrance, its own mailbox, its own electricity meter that turned every month — but no tenant that anyone had ever seen. I lived on the second floor for two years. Every night I heard a chair drag across the floor above me. Every Sunday, the faint smell of pipe tobacco. When I finally asked the landlord, he said: "The third floor pays its rent in cash, on time, slipped under my door. I have never asked questions." I moved out the next month. I do not know who lives there. I am not certain anyone does.',
    excerpt:
      'The third floor had its own mailbox and electricity meter — but no tenant that anyone had ever seen.',
    category: 'horror-fiction',
    author: 'E. Carver',
    isFiction: true,
    createdAt: Date.parse('2026-10-22T00:00:00Z'),
    reactions: { shiver: 71, skull: 55, heart: 42 },
  },
  {
    id: 'seed-5',
    title: 'I Stopped Recognizing My Reflection',
    content:
      'It started slowly. A delay — half a second — between when I moved and when the mirror followed. I told myself I was tired. Then the delay grew. A second. Two seconds. I would turn away and the reflection would still be looking at me. I stopped sleeping with the lights on. I covered the bathroom mirror with a towel. This morning I brushed my teeth in the dark, and when I pulled the towel away to rinse my mouth, the reflection was already smiling. I was not smiling. It kept smiling for a long moment, then stopped, and matched my face again. I have not looked in a mirror since.',
    excerpt:
      'I would turn away and the reflection would still be looking at me.',
    category: 'psychological-horror',
    author: 'Anonymous',
    isFiction: true,
    createdAt: Date.parse('2026-10-20T00:00:00Z'),
    reactions: { shiver: 203, skull: 91, heart: 58 },
  },
  {
    id: 'seed-6',
    title: 'The House at the End of Marrow Lane',
    content:
      'The house had been abandoned for years, but every Sunday the porch light came on at dusk and went off at dawn. No one in the neighborhood could explain it. The electricity had supposedly been cut in 1998. A group of us kids decided to investigate one October evening. The door was unlocked. Inside, the air was warm and smelled faintly of bread. A pot of coffee sat on the kitchen table, still steaming. The television was on, tuned to a channel of static. We ran. The next day the house was gone — not demolished, just gone. Marrow Lane now ends at an empty lot. Three of the five of us remember it. The other two do not remember Marrow Lane at all.',
    excerpt:
      'The door was unlocked. Inside, the air was warm and smelled faintly of bread.',
    category: 'haunted-places',
    author: 'J. Ortega',
    isFiction: true,
    createdAt: Date.parse('2026-10-17T00:00:00Z'),
    reactions: { shiver: 117, skull: 44, heart: 39 },
  },
  {
    id: 'seed-7',
    title: 'The Call From My Own Number',
    content:
      'My phone rang at 3:04 AM. The caller ID was my own number. I answered. There was breathing on the line — slow, steady, calm — and then a voice that sounded like mine said: "Do not go to work tomorrow." I hung up. I checked the call log. There was no record of the call. I went to work anyway. The elevator in my office building, which I take every morning, dropped three floors and then stopped. I was the only one in it. The doors opened onto a floor that should not exist — no walls, no desks, just a long hallway that ended in a door I had never seen. I pressed the lobby button. The doors closed and I descended normally. I quit that week.',
    excerpt:
      'The caller ID was my own number. The voice that sounded like mine said: "Do not go to work tomorrow."',
    category: 'unexplained',
    author: 'Anonymous',
    isFiction: false,
    createdAt: Date.parse('2026-10-15T00:00:00Z'),
    reactions: { shiver: 158, skull: 73, heart: 51 },
  },
];
