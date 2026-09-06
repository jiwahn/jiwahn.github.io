// Preserve previously shared project filters when moving the archive home.
const target = new URL(document.querySelector('script[data-target]').dataset.target, location.href);
const filters = new URLSearchParams(location.hash.slice(1));
if (filters.has('tag') || filters.has('category')) target.hash = location.hash;
location.replace(target.href);
