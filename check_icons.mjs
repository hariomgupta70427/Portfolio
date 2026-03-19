const TECH_ICONS = {
  // Mobile Dev
  'Flutter':        'https://cdn.simpleicons.org/flutter/54C5F8',
  'Dart':           'https://cdn.simpleicons.org/dart/0175C2',
  'Java':           'https://cdn.simpleicons.org/openjdk/ED8B00',
  'Kotlin':         'https://cdn.simpleicons.org/kotlin/7F52FF',
  'Android SDK':    'https://cdn.simpleicons.org/android/3DDC84',

  // AI & ML
  'Google Gemini':  'https://cdn.simpleicons.org/googlegemini/8E75B2',
  'OpenAI':         'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg',
  'Claude':         'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/anthropic.svg',
  'Perplexity':     'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/perplexity.svg',
  'Hugging Face':   'https://cdn.simpleicons.org/huggingface/FFD21E',

  // Frontend
  'React':          'https://cdn.simpleicons.org/react/61DAFB',
  'Next.js':        'https://cdn.simpleicons.org/nextdotjs/FFFFFF',
  'TypeScript':     'https://cdn.simpleicons.org/typescript/3178C6',
  'Tailwind CSS':   'https://cdn.simpleicons.org/tailwindcss/06B6D4',
  'HTML5/CSS3':     'https://cdn.simpleicons.org/html5/E34F26',

  // Backend
  'Node.js':        'https://cdn.simpleicons.org/nodedotjs/339933',
  'Express.js':     'https://cdn.simpleicons.org/express/FFFFFF',
  'Firebase':       'https://cdn.simpleicons.org/firebase/FFCA28',
  'Supabase':       'https://cdn.simpleicons.org/supabase/3ECF8E',
  'MongoDB':        'https://cdn.simpleicons.org/mongodb/47A248',
  'MySQL':          'https://cdn.simpleicons.org/mysql/4479A1',

  // Languages
  'Python':         'https://cdn.simpleicons.org/python/3776AB',
  'JavaScript':     'https://cdn.simpleicons.org/javascript/F7DF1E',
  'C/C++':          'https://cdn.simpleicons.org/cplusplus/00599C',

  // DevOps & Tools
  'Git':            'https://cdn.simpleicons.org/git/F05032',
  'Docker':         'https://cdn.simpleicons.org/docker/2496ED',
  'Vercel':         'https://cdn.simpleicons.org/vercel/FFFFFF',
  'Netlify':        'https://cdn.simpleicons.org/netlify/00C7B7',
  'Figma':          'https://cdn.simpleicons.org/figma/F24E1E',
  'WordPress':      'https://cdn.simpleicons.org/wordpress/21759B',
  'VS Code':        'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/visualstudiocode.svg',
  'GitHub':         'https://cdn.simpleicons.org/github/FFFFFF',
};

async function check() {
  for (const [name, url] of Object.entries(TECH_ICONS)) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        console.log(`Failed: ${name} -> ${url} (${resp.status})`);
      }
    } catch (e) {
      console.log(`Error: ${name} -> ${url} (${e.message})`);
    }
  }
  console.log('Done checking icons.');
}
check();
