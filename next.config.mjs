import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/game',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['hackmd.io'],
  },
  output: "standalone",
};

const withMDX = createMDX({

})

export default withMDX(nextConfig)