import { Kysely } from 'kysely'

import { hash } from '@/lib/auth/password'

const users = [
  {
    name: 'John Smith',
    handle: 'johnsmith23',
    email: 'johnsmith23@gmail.com',
    password: 'P@ssw0rd',
    description:
      'John Smith is a software engineer with over 10 years of experience in developing web applications using various technologies and frameworks. He is passionate about creating scalable and efficient solutions to complex problems.',
  },
  {
    name: 'Jane Johnson',
    handle: 'janejohnson17',
    email: 'janejohnson17@yahoo.com',
    password: 'Secret123',
    description:
      'Jane Johnson is a talented graphic designer known for her innovative designs and attention to detail. With a background in visual arts and digital media, she brings creativity and style to every project she works on.',
  },
  {
    name: 'Michael Williams',
    handle: 'michaelwills',
    email: 'michaelwills@outlook.com',
    password: 'M1chael',
    description:
      'Michael Williams is a marketing specialist with expertise in digital marketing strategies, content creation, and social media management. He has successfully executed campaigns for a diverse range of clients, driving engagement and brand awareness.',
  },
  {
    name: 'Emily Jones',
    handle: 'emily_j',
    email: 'emilyjones56@hotmail.com',
    password: 'Ems1234',
    description:
      'Emily Jones is a dedicated teacher with a passion for empowering students through education. She believes in creating inclusive and interactive learning environments where every student can thrive and reach their full potential.',
  },
  {
    name: 'David Brown',
    handle: 'dbrownie',
    email: 'dbrownie89@gmail.com',
    password: 'Brownie44',
    description:
      'David Brown is a visionary entrepreneur with a track record of building successful startups from the ground up. He is driven by innovation and a desire to disrupt traditional industries with cutting-edge solutions.',
  },
  {
    name: 'Sarah Davis',
    handle: 'sarahd',
    email: 'sarahdavis32@yahoo.com',
    password: 'Sarah@123',
    description:
      'Sarah Davis is a prolific writer with a knack for storytelling across various genres. With a keen eye for detail and a passion for words, she captivates readers with her engaging narratives and thought-provoking content.',
  },
  {
    name: 'Chris Miller',
    handle: 'chrismiller',
    email: 'chrismiller45@outlook.com',
    password: 'MillerC',
    description:
      'Chris Miller is a versatile artist whose work spans across mediums including painting, sculpture, and digital art. With a unique perspective and a dedication to his craft, he creates visually stunning pieces that evoke emotion and inspire.',
  },
  {
    name: 'Jessica Wilson',
    handle: 'jwilson',
    email: 'jwilson78@hotmail.com',
    password: 'J3ss1ca',
    description:
      'Jessica Wilson is a talented musician with a soulful voice and a passion for performance. She connects with audiences through her heartfelt lyrics and dynamic stage presence, leaving a lasting impression wherever she goes.',
  },
  {
    name: 'Matthew Moore',
    handle: 'mmoore',
    email: 'mmoore56@aol.com',
    password: 'MattyM',
    description:
      'Matthew Moore is a skilled chef with expertise in culinary arts and gastronomy. With a focus on quality ingredients and innovative techniques, he creates memorable dining experiences that delight the senses and satisfy the palate.',
  },
  {
    name: 'Amanda Taylor',
    handle: 'ataylor',
    email: 'ataylor99@gmail.com',
    password: 'TaylorA',
    description:
      "Amanda Taylor is a dedicated athlete with a passion for fitness and wellness. Whether she's in the gym or on the field, she pushes herself to new heights and inspires others to pursue their own health and fitness goals.",
  },
  {
    name: 'Justin Lee',
    handle: 'justinlee',
    email: 'justinlee123@outlook.com',
    password: 'LeeJustin',
    description:
      'Justin Lee is a compassionate doctor committed to providing quality healthcare to his patients. With expertise in internal medicine and a focus on preventative care, he empowers patients to take control of their health and well-being.',
  },
  {
    name: 'Hannah White',
    handle: 'hannahwhite',
    email: 'hannah.white@gmail.com',
    password: 'WhiteHannah',
    description:
      'Hannah White is a dedicated lawyer known for her expertise in corporate law and contract negotiations. With a sharp legal mind and a strategic approach, she navigates complex legal issues with confidence and integrity.',
  },
  {
    name: 'Andrew Thompson',
    handle: 'andrewt',
    email: 'andrew.thompson@yahoo.com',
    password: 'ThompsonA',
    description:
      'Andrew Thompson is a visionary architect with a passion for sustainable design and urban planning. With a focus on creating spaces that enhance the quality of life for communities, he integrates innovation and functionality into his projects.',
  },
  {
    name: 'Lauren Garcia',
    handle: 'laureng',
    email: 'laurengarcia@aol.com',
    password: 'GarciaLauren',
    description:
      'Lauren Garcia is an investigative journalist known for her commitment to uncovering the truth and holding those in power accountable. With a relentless pursuit of justice, she fearlessly reports on issues that matter most to society.',
  },
  {
    name: 'Kevin Martinez',
    handle: 'kevinm',
    email: 'kevin.martinez@hotmail.com',
    password: 'MartinezK',
    description:
      "Kevin Martinez is a passionate photographer with a keen eye for capturing moments of beauty and emotion. Whether he's shooting landscapes or portraits, he brings creativity and technical expertise to every photo he takes.",
  },
  {
    name: 'Olivia Robinson',
    handle: 'oliviar',
    email: 'oliviarobinson@gmail.com',
    password: 'RobinsonO',
    description:
      'Olivia Robinson is a seasoned banker with a wealth of experience in financial management and investment strategies. With a focus on building long-term relationships and delivering personalized service, she helps clients achieve their financial goals.',
  },
  {
    name: 'Daniel Clark',
    handle: 'danielc',
    email: 'danielclark@gmail.com',
    password: 'ClarkD123',
    description:
      'Daniel Clark is a results-driven consultant known for his strategic insights and problem-solving skills. With a knack for identifying opportunities for growth and improvement, he partners with clients to drive organizational success.',
  },
  {
    name: 'Sophia Hall',
    handle: 'sophiah',
    email: 'sophia.hall@yahoo.com',
    password: 'HallSophia',
    description:
      'Sophia Hall is a talented fashion designer with a flair for creating chic and sophisticated clothing. With a focus on timeless elegance and modern trends, she designs garments that empower individuals to express their unique style.',
  },
  {
    name: 'Nathan Wright',
    handle: 'nathanw',
    email: 'nathan.wright@gmail.com',
    password: 'WrightN',
    description:
      'Nathan Wright is a skilled engineer with expertise in mechanical and electrical systems. With a passion for innovation and problem-solving, he designs and implements solutions that improve efficiency and performance.',
  },
  {
    name: 'Isabella Lewis',
    handle: 'isabellal',
    email: 'isabella.lewis@hotmail.com',
    password: 'LewisI123',
    description:
      'Isabella Lewis is a talented artist known for her vibrant paintings and mixed-media creations. With a unique style and a passion for experimentation, she pushes the boundaries of traditional art forms and inspires others to embrace their creativity.',
  },
]

export async function up(db: Kysely<any>): Promise<void> {
  for (const user of users) {
    await db
      .insertInto('User')
      .values({
        ...user,
        emailVerified: new Date(),
        password: hash(user.password),
      })
      .execute()
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('User').execute()
}
