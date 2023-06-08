/** @type {import('next').NextConfig} */
require('dotenv').config();



const nextConfig = {
  reactStrictMode: true,
  env: {
    CLIENT_SECRET:"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",
    CLIENT_ID:"1088046670511-vdt3m08203aaogb0bno3a1n2kevn1kgi.apps.googleusercontent.com"
  }

}

module.exports = nextConfig
