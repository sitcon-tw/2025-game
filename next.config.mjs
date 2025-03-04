import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/game',
        permanent: true, 
      },
    ];
  },
};

const withMDX = createMDX({
  
})

export default withMDX(nextConfig)