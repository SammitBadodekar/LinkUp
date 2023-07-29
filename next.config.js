/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPWA({
  images: {
    domains: ["lh3.googleusercontent.com", "loremflickr.com"],
  },
});
