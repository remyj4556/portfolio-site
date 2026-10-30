import type { Project } from './types.ts'

export const projects = [
  {
    id: 'project-alpha',
    title: 'Project Alpha',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    image: { src: '/projects/project-alpha.webp', alt: 'Placeholder screenshot of Project Alpha' },
    displayUrl: 'alpha.example.com',
    links: {
      source: 'https://github.com/your-username/project-alpha',
      demo: 'https://alpha.example.com',
    },
    problem:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
    contribution:
      'Sed posuere consectetur est at lobortis. Maecenas faucibus mollis interdum, cras mattis consectetur purus sit amet fermentum.',
    outcome: 'Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper.',
    highlights: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Nullam quis risus eget urna mollis ornare vel eu leo.',
      'Aenean lacinia bibendum nulla sed consectetur.',
    ],
  },
  {
    id: 'project-beta',
    title: 'Project Beta',
    summary: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
    tech: ['Go', 'gRPC', 'Docker'],
    displayUrl: 'beta.example.com',
    links: { source: 'https://github.com/your-username/project-beta' },
    problem: 'Curabitur blandit tempus porttitor. Nulla vitae elit libero, a pharetra augue.',
    contribution:
      'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Etiam porta sem malesuada magna mollis euismod.',
    outcome: 'Maecenas sed diam eget risus varius blandit sit amet non magna.',
  },
  {
    id: 'project-gamma',
    title: 'Project Gamma',
    summary: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.',
    tech: ['Python', 'FastAPI', 'Redis', 'WebSockets', 'AWS'],
    image: { src: '/projects/project-gamma.webp', alt: 'Placeholder screenshot of Project Gamma' },
    displayUrl: 'gamma.example.com',
    problem: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac.',
    contribution: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo.',
    outcome: 'Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.',
    highlights: ['Praesent commodo cursus magna, vel scelerisque nisl consectetur et.', 'Donec id elit non mi porta gravida at eget metus.'],
  },
  {
    id: 'project-delta',
    title: 'Project Delta',
    summary: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
    tech: ['Rust', 'WebAssembly', 'Svelte'],
    image: { src: '/projects/project-delta.webp', alt: 'Placeholder screenshot of Project Delta' },
    links: {
      source: 'https://github.com/your-username/project-delta',
      demo: 'https://delta.example.com',
    },
    problem: 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
    contribution: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient.',
    outcome: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
  },
] satisfies Project[]
